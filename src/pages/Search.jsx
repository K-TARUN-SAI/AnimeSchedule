import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, X, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cacheFetch } from '../utils/api';
import AnimeCard from '../components/AnimeCard';

const SEARCH_QUERY = `
query ($page: Int, $perPage: Int, $search: String, $genres: [String], $tags: [String], $format: [MediaFormat], $status: [MediaStatus], $season: MediaSeason, $seasonYear: Int, $score_greater: Int, $sort: [MediaSort], $isAdult: Boolean) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(type: ANIME, search: $search, genre_in: $genres, tag_in: $tags, format_in: $format, status_in: $status, season: $season, seasonYear: $seasonYear, averageScore_greater: $score_greater, sort: $sort, isAdult: $isAdult) {
      id
      title {
        romaji
        english
        native
      }
      coverImage {
        extraLarge
        large
      }
      bannerImage
      description
      episodes
      status
      averageScore
      genres
      type
      format
      season
      seasonYear
      isAdult
    }
  }
}
`;

export default function Search({ onOpenAnime, titleLang, showAdult }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const genresParam = searchParams.get('genres')?.split(',').filter(Boolean) || [];
  
  // Advanced Filter Params
  const formatParam = searchParams.get('format') || '';
  const statusParam = searchParams.get('status') || '';
  const scoreParam = searchParams.get('score') || '';
  const seasonParam = searchParams.get('season') || '';
  const yearParam = searchParams.get('year') || '';
  const sortParam = searchParams.get('sort') || 'POPULARITY_DESC';

  const ALL_GENRES_REF = [
    "Action", "Adventure", "Cars", "Comedy", "Dementia", "Demons", "Drama", "Ecchi", "Fantasy", "Game", "Harem", "Historical", "Horror", "Isekai", "Josei", "Kids", "Magic", "Martial Arts", "Mecha", "Military", "Music", "Mystery", "Parody", "Police", "Psychological", "Romance", "Samurai", "School", "Sci-Fi", "Seinen", "Shoujo", "Shoujo Ai", "Shounen", "Shounen Ai", "Slice of Life", "Space", "Sports", "Super Power", "Supernatural", "Thriller", "Vampire"
  ];

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [availableGenres, setAvailableGenres] = useState(ALL_GENRES_REF);
  const [officialGenres, setOfficialGenres] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const query = `{ GenreCollection }`;
        const res = await cacheFetch('https://graphql.anilist.co', {
          method: 'POST',
          body: JSON.stringify({ query })
        }, 'anilist_official_genres', 24 * 60 * 60 * 1000);
        
        if (res?.data?.data?.GenreCollection) {
          setOfficialGenres(res.data.data.GenreCollection);
          setAvailableGenres(prev => [...new Set([...prev, ...res.data.data.GenreCollection])].sort());
        }
      } catch (err) {
        console.error("Error fetching genres:", err);
      }
    };
    fetchGenres();
  }, []);

  const fetchResults = useCallback(async (isNewSearch = true) => {
    try {
      setLoading(true);
      const currentPage = isNewSearch ? 1 : page;
      
      // Split genresParam into official genres and tags
      const selectedGenres = genresParam.filter(g => officialGenres.includes(g));
      const selectedTags = genresParam.filter(g => !officialGenres.includes(g));

      const variables = {
        page: currentPage,
        perPage: 20,
        search: queryParam || undefined,
        genres: selectedGenres.length > 0 ? selectedGenres : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
        format: formatParam ? [formatParam] : undefined,
        status: statusParam ? [statusParam] : undefined,
        season: seasonParam || undefined,
        seasonYear: yearParam ? parseInt(yearParam) : undefined,
        score_greater: scoreParam ? parseInt(scoreParam) : undefined,
        sort: [sortParam],
        isAdult: showAdult
      };

      const cacheKey = `adv_search_v2_${JSON.stringify(variables)}_${showAdult}`;
      const res = await cacheFetch('https://graphql.anilist.co', {
        method: 'POST',
        body: JSON.stringify({ query: SEARCH_QUERY, variables })
      }, cacheKey);

      if (res?.data?.data?.Page) {
        const newMedia = res.data.data.Page.media;
        setResults(prev => isNewSearch ? newMedia : [...prev, ...newMedia]);
        setHasNextPage(res.data.data.Page.pageInfo.hasNextPage);
        if (!isNewSearch) setPage(prev => prev + 1);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, [queryParam, genresParam, formatParam, statusParam, scoreParam, seasonParam, yearParam, sortParam, page, officialGenres, showAdult]);

  useEffect(() => {
    setPage(1);
    fetchResults(true);
  }, [queryParam, searchParams.toString(), showAdult]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'Default') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const toggleGenre = (genre) => {
    const newGenres = genresParam.includes(genre)
      ? genresParam.filter(g => g !== genre)
      : [...genresParam, genre];
    updateParam('genres', newGenres.join(','));
  };

  const CustomSelect = ({ label, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = React.useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value) || { label: 'All', value: 'All' };

    return (
      <div className="relative group" ref={containerRef}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-3 bg-card-bg/40 border border-border rounded-xl px-4 py-2.5 backdrop-blur-md cursor-pointer transition-all hover:border-primary/50 ${isOpen ? 'ring-2 ring-primary/20 border-primary/50' : ''}`}
        >
          <span className="text-[10px] font-black uppercase text-text-muted whitespace-nowrap tracking-wider">{label}</span>
          <span className="text-xs font-bold text-primary flex-grow min-w-[60px]">{selectedOption.label}</span>
          <ChevronDown className={`w-3.5 h-3.5 text-text-muted transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 5, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute z-50 top-full left-0 w-full min-w-[160px] bg-card-bg/95 border border-border/50 rounded-xl shadow-2xl backdrop-blur-2xl overflow-hidden py-1.5"
            >
              <div 
                onClick={() => { onChange('All'); setIsOpen(false); }}
                className="px-4 py-2 text-xs font-bold text-text-muted hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
              >
                All
              </div>
              {options.map(opt => (
                <div 
                  key={opt.value}
                  onClick={() => { onChange(opt.value); setIsOpen(false); }}
                  className={`px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${value === opt.value ? 'bg-primary/20 text-primary' : 'text-text hover:bg-white/5 hover:text-primary'}`}
                >
                  {opt.label}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6 lg:space-y-10 pb-20">
      <div className="bg-card-bg/30 p-6 lg:p-12 rounded-[1.5rem] lg:rounded-[2.5rem] border border-border backdrop-blur-3xl shadow-2xl">
        <h3 className="text-lg lg:text-xl font-black italic tracking-tighter uppercase flex items-center gap-3 text-text mb-8 lg:text-text mb-10">
          <span className="w-2 h-6 bg-primary rounded-full" />
          Filter & Discover
        </h3>
        
        {/* Row 1 */}
        <div className="flex flex-wrap gap-4 mb-10">
          <CustomSelect 
            label="Type" 
            value={formatParam} 
            onChange={(v) => updateParam('format', v)}
            options={[{ label: 'TV', value: 'TV' }, { label: 'Movie', value: 'MOVIE' }, { label: 'OVA', value: 'OVA' }, { label: 'ONA', value: 'ONA' }, { label: 'Special', value: 'SPECIAL' }]}
          />
          <CustomSelect 
            label="Status" 
            value={statusParam} 
            onChange={(v) => updateParam('status', v)}
            options={[{ label: 'Finished', value: 'FINISHED' }, { label: 'Releasing', value: 'RELEASING' }, { label: 'Upcoming', value: 'NOT_YET_RELEASED' }]}
          />
          <CustomSelect 
            label="Rated" 
            value={searchParams.get('rated')} 
            onChange={(v) => updateParam('rated', v)}
            options={[{ label: 'G', value: 'G' }, { label: 'PG', value: 'PG' }, { label: 'PG-13', value: 'PG13' }, { label: 'R', value: 'R' }]}
          />
          <CustomSelect 
            label="Score" 
            value={scoreParam} 
            onChange={(v) => updateParam('score', v)}
            options={[{ label: '70+', value: '70' }, { label: '80+', value: '80' }, { label: '90+', value: '90' }]}
          />
          <CustomSelect 
            label="Season" 
            value={seasonParam} 
            onChange={(v) => updateParam('season', v)}
            options={[{ label: 'Winter', value: 'WINTER' }, { label: 'Spring', value: 'SPRING' }, { label: 'Summer', value: 'SUMMER' }, { label: 'Fall', value: 'FALL' }]}
          />
          <CustomSelect 
            label="Language" 
            value={searchParams.get('lang')} 
            onChange={(v) => updateParam('lang', v)}
            options={[{ label: 'Sub', value: 'sub' }, { label: 'Dub', value: 'dub' }]}
          />
        </div>

        {/* Row 2 */}
        <div className="flex flex-wrap gap-4 mb-12">
          <div className="flex items-center gap-4 bg-card-bg/40 border border-border rounded-xl px-4 py-2.5 backdrop-blur-md">
            <span className="text-[10px] font-black uppercase text-text-muted whitespace-nowrap tracking-wider">Start Date</span>
            <div className="flex items-center gap-2">
              <CustomSelect 
                label="" 
                value={yearParam} 
                onChange={(v) => updateParam('year', v)}
                options={Array.from({ length: 50 }, (_, i) => ({ label: `${2025 - i}`, value: `${2025 - i}` }))}
              />
              <CustomSelect 
                label="" 
                value={searchParams.get('month')} 
                onChange={(v) => updateParam('month', v)}
                options={Array.from({ length: 12 }, (_, i) => ({ label: `${i + 1}`, value: `${i + 1}` }))}
              />
            </div>
          </div>

          <CustomSelect 
            label="Sort By" 
            value={sortParam || 'POPULARITY_DESC'} 
            onChange={(v) => updateParam('sort', v)}
            options={[
              { label: 'Trending', value: 'TRENDING_DESC' },
              { label: 'Popularity', value: 'POPULARITY_DESC' },
              { label: 'Score', value: 'SCORE_DESC' },
              { label: 'Newest', value: 'START_DATE_DESC' }
            ]}
          />
        </div>

        <h3 className="text-xl font-black italic tracking-tighter uppercase flex items-center gap-3 text-text mb-8">
          <span className="w-2 h-6 bg-secondary rounded-full" />
          Genre Selection
        </h3>
        <div className="flex flex-wrap gap-2 mb-10">
          {availableGenres.map(genre => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all border ${genresParam.includes(genre) ? 'bg-secondary border-secondary text-white shadow-lg shadow-secondary/20' : 'bg-background/40 border-border text-text-muted hover:text-text hover:border-text-muted'}`}
            >
              {genre}
            </button>
          ))}
        </div>

        <button 
          onClick={() => fetchResults(true)}
          className="bg-primary hover:bg-primary/90 text-white font-black px-12 py-4 rounded-xl uppercase tracking-widest text-sm shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          Apply Filters
        </button>
      </div>

      <div className="flex items-center justify-between px-4">
        <h4 className="text-lg font-black uppercase italic tracking-tighter text-text border-l-4 border-primary pl-4">
          {queryParam ? `Results for "${queryParam}"` : 'Browse Results'}
          {(genresParam.length > 0 || formatParam || statusParam) && <span className="text-primary ml-2">+ Advanced Filter</span>}
        </h4>
        <div className="h-px flex-grow mx-8 bg-border/50" />
      </div>

      {loading && results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-40 gap-6">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-text-muted font-black uppercase tracking-widest text-xs">Summoning the best titles...</p>
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 animate-in fade-in duration-700">
          {results.map((anime, idx) => (
            <AnimeCard 
              key={`${anime.id}-${idx}`} 
              anime={anime} 
              index={idx} 
              onOpen={() => onOpenAnime(anime)} 
              titleLang={titleLang}
            />
          ))}
        </div>
      ) : !loading && (
        <div className="text-center py-40 bg-card-bg/20 rounded-[3rem] border border-border border-dashed">
           <p className="text-text-muted text-2xl italic font-medium mb-4">No results for this combination.</p>
           <p className="text-text-muted text-xs uppercase tracking-[0.2em]">Try clearing filters or checking your spelling</p>
        </div>
      )}

      {hasNextPage && !loading && (
        <div className="flex justify-center pt-10">
          <button 
            onClick={() => fetchResults(false)}
            className="px-12 py-5 bg-white/5 border border-border hover:border-primary/50 text-text font-black rounded-2xl hover:bg-primary/10 transition-all uppercase tracking-widest text-xs shadow-2xl"
          >
            Load More Results
          </button>
        </div>
      )}
    </div>
  );
}
