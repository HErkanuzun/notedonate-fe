import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Filter } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import ExamCard from '../components/ExamCard';
import FilterPanel from '../components/FilterPanel';
import LoadingCard from '../components/LoadingCard';
import * as ExamService from '../services/api/ExamService';
import { Exam } from '../types';

interface ExamsPageProps {
  isDark: boolean;
}

function ExamsPage({ isDark }: ExamsPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    university: '',
    department: '',
    year: null as number | null,
    semester: '',
    search: ''
  });
  const [exams, setExams] = useState<Exam[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);

  const lastExamElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoadingMore, hasMore]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setFilterOptions(prev => ({ ...prev, search: query }));
    setPage(1); // Reset page when search changes
  }, []);

  const handleFilterChange = useCallback((newOptions: any) => {
    setFilterOptions(prev => ({ ...prev, ...newOptions }));
    setPage(1); // Reset page when filters change
  }, []);

  const fetchExams = async (pageNum: number) => {
    try {
      setIsLoadingMore(pageNum > 1);
      const filters = {
        ...filterOptions,
        year: filterOptions.year || undefined,
        search: searchQuery
      };
      
      const response = await ExamService.getAllExams({ 
        page: pageNum,
        filters
      });
      
      if (response && response.data) {
        const { exams, meta } = response.data;
        if (pageNum === 1) {
          setExams(exams);
        } else {
          setExams(prev => [...prev, ...exams]);
        }
        setHasMore(pageNum < meta.last_page);
      }
    } catch (error) {
      console.error('Error fetching exams:', error);
      setExams([]);
      setHasMore(false);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    setPage(1);
    fetchExams(1);
  }, [filterOptions, searchQuery]);

  useEffect(() => {
    if (page > 1) {
      fetchExams(page);
    }
  }, [page]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Sınavlar</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`lg:hidden flex items-center gap-2 px-4 py-2 rounded-lg
              ${isDark ? 'bg-gray-800' : 'bg-white'} border
              ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <Filter size={20} />
            Filtrele
          </button>
        </div>
        <SearchBar
          isDark={isDark}
          onSearch={handleSearch}
          placeholder="Sınav ara..."
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <FilterPanel
            isDark={isDark}
            options={filterOptions}
            onFilterChange={handleFilterChange}
            universities={['Üniversite A', 'Üniversite B']} // Replace with actual data
            departments={['Bölüm A', 'Bölüm B']} // Replace with actual data
            years={['2023', '2024']} // Replace with actual data
            semesters={['Güz', 'Bahar']} // Replace with actual data
          />
        </div>

        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <LoadingCard key={index} isDark={isDark} />
              ))}
            </div>
          ) : exams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exams.map((exam, index) => (
                <div
                  key={exam.id}
                  ref={index === exams.length - 1 ? lastExamElementRef : undefined}
                >
                  <ExamCard exam={exam} isDark={isDark} />
                </div>
              ))}
              {isLoadingMore && (
                <div className="col-span-full flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Aradığınız kriterlere uygun sınav bulunamadı.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExamsPage;