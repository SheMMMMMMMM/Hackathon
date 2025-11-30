from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import httpx
from typing import List, Optional
from datetime import datetime

router = APIRouter()

NEWS_API_KEY = os.getenv('NEWS_API_KEY')
NEWS_API_URL = 'https://newsapi.org/v2/top-headlines'

class NewsArticle(BaseModel):
    title: str
    description: Optional[str]
    url: str
    urlToImage: Optional[str]
    publishedAt: str
    source: str

class NewsResponse(BaseModel):
    articles: List[NewsArticle]
    totalResults: int

@router.get("/news", response_model=NewsResponse)
async def get_news(
    country: str = 'us',
    category: Optional[str] = None,
    language: str = 'en'
):
    """
    Fetch top news headlines from NewsAPI.
    
    Parameters:
    - country: Country code (us, gb, de, etc.)
    - category: Category (business, entertainment, health, science, sports, technology)
    - language: Language code (en, de, sk, cs)
    """
    if not NEWS_API_KEY:
        raise HTTPException(status_code=500, detail="NEWS_API_KEY not configured")
    
    # Map language codes to countries for better relevance
    country_map = {
        'en': 'us',
        'de': 'de',
        'sk': 'sk',
        'cs': 'cz'
    }
    
    # Use language to determine country if not explicitly set
    if country == 'us' and language in country_map:
        country = country_map[language]
    
    params = {
        'apiKey': NEWS_API_KEY,
        'country': country,
        'pageSize': 10
    }
    
    if category:
        params['category'] = category
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(NEWS_API_URL, params=params, timeout=10.0)
            response.raise_for_status()
            data = response.json()
            
            if data['status'] != 'ok':
                raise HTTPException(status_code=500, detail="NewsAPI returned an error")
            
            articles = []
            for article in data.get('articles', []):
                articles.append(NewsArticle(
                    title=article.get('title', 'No title'),
                    description=article.get('description'),
                    url=article.get('url', ''),
                    urlToImage=article.get('urlToImage'),
                    publishedAt=article.get('publishedAt', ''),
                    source=article.get('source', {}).get('name', 'Unknown')
                ))
            
            return NewsResponse(
                articles=articles,
                totalResults=data.get('totalResults', 0)
            )
    
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch news: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
