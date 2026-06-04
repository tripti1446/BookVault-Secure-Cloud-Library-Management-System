import React, { useState } from 'react';
import {
  Plus,
  Search,
  BookOpen,
  Edit2,
  Trash2,
  Eye,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  UploadCloud,
  FileCheck2,
  CheckCircle,
  Hash,
  MapPin,
  Bookmark,
  CalendarDays
} from 'lucide-react';
import { Book } from '../types';

interface BooksViewProps {
  books: Book[];
  onAddBook: (book: Omit<Book, 'id'>) => void;
  onUpdateBook: (book: Book) => void;
  onDeleteBook: (id: string) => void;
  selectedBookId?: string | null;
  clearSelectedBookId?: () => void;
}

export default function BooksView({
  books,
  onAddBook,
  onUpdateBook,
  onDeleteBook,
  selectedBookId,
  clearSelectedBookId
}: BooksViewProps) {
  const [viewMode, setViewMode] = useState<'list' | 'add' | 'edit' | 'detail'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formCategory, setFormCategory] = useState('Computer Science');
  const [formIsbn, setFormIsbn] = useState('');
  const [formPublisher, setFormPublisher] = useState('');
  const [formPublishYear, setFormPublishYear] = useState('2026');
  const [formCopies, setFormCopies] = useState<number>(10);
  const [formLocation, setFormLocation] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCoverColor, setFormCoverColor] = useState('from-[#0B1B3D] to-indigo-950');

  // Drag & drop file upload sim
  const [dragActive, setDragActive] = useState(false);
  const [uploadedCoverName, setUploadedCoverName] = useState<string | null>(null);

  // Selected book for edit/detail
  const [activeBook, setActiveBook] = useState<Book | null>(null);

  // Categories
  const categoriesList = ['Computer Science', 'Engineering', 'Management', 'Science', 'Arts & Humanities'];

  // Handle selected book from prop (e.g. from Dashboard quick link)
  React.useEffect(() => {
    if (selectedBookId) {
      const b = books.find(item => item.id === selectedBookId);
      if (b) {
        setActiveBook(b);
        setViewMode('detail');
      }
      if (clearSelectedBookId) clearSelectedBookId();
    }
  }, [selectedBookId, books]);

  // Apply filters
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm);
    const matchesCategory = categoryFilter === 'All' || book.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination Math
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetForm = () => {
    setFormTitle('');
    setFormAuthor('');
    setFormCategory('Computer Science');
    setFormIsbn('');
    setFormPublisher('');
    setFormPublishYear('2026');
    setFormCopies(10);
    setFormLocation('');
    setFormDescription('');
    setFormCoverColor('from-[#0B1B3D] to-indigo-950');
    setUploadedCoverName(null);
    setActiveBook(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setViewMode('add');
  };

  const handleOpenEdit = (book: Book) => {
    setActiveBook(book);
    setFormTitle(book.title);
    setFormAuthor(book.author);
    setFormCategory(book.category);
    setFormIsbn(book.isbn);
    setFormPublisher(book.publisher);
    setFormPublishYear(book.publishYear);
    setFormCopies(book.copies);
    setFormLocation(book.location);
    setFormDescription(book.description);
    setFormCoverColor(book.coverColor);
    setUploadedCoverName('Saved_Cover_Template.jpg');
    setViewMode('edit');
  };

  const handleOpenDetail = (book: Book) => {
    setActiveBook(book);
    setViewMode('detail');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (viewMode === 'add') {
      onAddBook({
        title: formTitle || 'Untitled volume',
        author: formAuthor || 'Unknown Author',
        category: formCategory,
        isbn: formIsbn || `${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
        publisher: formPublisher || 'BookVault Press',
        publishYear: formPublishYear || '2026',
        copies: formCopies,
        available: formCopies,
        location: formLocation || 'Shelf General',
        description: formDescription || 'No abstract summary recorded.',
        coverColor: formCoverColor
      });
      setViewMode('list');
    } else if (viewMode === 'edit' && activeBook) {
      onUpdateBook({
        ...activeBook,
        title: formTitle,
        author: formAuthor,
        category: formCategory,
        isbn: formIsbn,
        publisher: formPublisher,
        publishYear: formPublishYear,
        copies: formCopies,
        location: formLocation,
        description: formDescription,
        coverColor: formCoverColor
      });
      setViewMode('list');
    }
  };

  // Drag and Drop simulation Handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedCoverName(e.dataTransfer.files[0].name);
    }
  };

  const selectColorVariant = (gradientString: string) => {
    setFormCoverColor(gradientString);
  };

  return (
    <div className="space-y-6" id="books-workspace">
      
      {/* Title & Add Volume CTA Column */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">
            {viewMode === 'list' && 'Books Registry'}
            {viewMode === 'add' && 'Onboard New Volume'}
            {viewMode === 'edit' && `Refactor: ${activeBook?.title}`}
            {viewMode === 'detail' && 'Book Specifications'}
          </h1>
          <p className="text-slate-500 text-sm">
            {viewMode === 'list' && 'Manage physical stock, catalogue location coordinates and ISBN metadata'}
            {viewMode === 'add' && 'Add custom meta, categorizations, inventories and custom color cover templates'}
            {viewMode === 'edit' && 'Amend stock records, publishing dates or shelf localization codes'}
            {viewMode === 'detail' && 'Full catalog card record and active issue log history'}
          </p>
        </div>

        {viewMode === 'list' ? (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl text-center shadow-lg hover:shadow-blue-600/15 transition-all cursor-pointer"
            id="onboard-new-book-ctrl"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
        ) : (
          <button
            onClick={() => setViewMode('list')}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-xl text-center border border-slate-200 shadow-sm transition-all cursor-pointer"
            id="back-to-books-list"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Inventory</span>
          </button>
        )}
      </div>

      {/* VIEW PANEL 1: LIST DIRECTORY GRID */}
      {viewMode === 'list' && (
        <div className="space-y-4" id="books-list-view">
          {/* Filtering Workspace */}
          <div className="bg-white p-4 rounded-xl border border-slate-200/85 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center bg-gradient-to-r from-white via-slate-50/20 to-slate-50/50">
            {/* Search Input Filter */}
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4" />
              </span>
              <input
                type="text"
                placeholder="Search Title, Author, ISBN..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all font-medium"
                id="books-search-field"
              />
            </div>

            {/* Segment selectors */}
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0" id="category-pills">
              <button
                onClick={() => { setCategoryFilter('All'); setCurrentPage(1); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  categoryFilter === 'All'
                    ? 'bg-[#0B1B3D] text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                All Categories
              </button>
              {categoriesList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategoryFilter(cat); setCurrentPage(1); }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-slate-500 border border-slate-200 hover:text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Core Inventory Table Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden" id="inventory-data-table">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6"># ID</th>
                    <th className="py-4 px-6">Book Cover</th>
                    <th className="py-4 px-6">Book Description & Title</th>
                    <th className="py-4 px-6">Author / Publisher</th>
                    <th className="py-4 px-6">Classification</th>
                    <th className="py-4 px-6">ISBN Metadata</th>
                    <th className="py-4 px-6 text-center">In Stock</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                  {paginatedBooks.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-slate-400 font-semibold bg-slate-50/20">
                        <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                        <span>No books found and catalog matches are zero.</span>
                      </td>
                    </tr>
                  ) : (
                    paginatedBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-slate-50/60 transition-colors group">
                        <td className="py-4 px-6 font-mono font-bold text-slate-400 text-[10px]">{book.id}</td>
                        <td className="py-4 px-6">
                          {/* Aesthetic Cover Placeholder design */}
                          <div className={`w-11 h-15 rounded-md bg-gradient-to-br ${book.coverColor} flex flex-col justify-between p-1.5 shadow-md flex-shrink-0 relative overflow-hidden group-hover:scale-105 transition-transform`}>
                            <div className="text-[6px] font-bold text-slate-300/80 uppercase tracking-widest leading-none truncate max-w-[36px]">
                              {book.category}
                            </div>
                            <div className="text-[7px] text-white font-extrabold line-clamp-2 leading-tight">
                              {book.title}
                            </div>
                            <div className="text-[5px] text-indigo-300 font-medium truncate">
                              {book.author}
                            </div>
                            <span className="absolute right-0.5 bottom-0.5 text-[6px] text-slate-400/50 font-mono">VB</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 max-w-xs">
                          <div>
                            <span
                              onClick={() => handleOpenDetail(book)}
                              className="font-bold text-slate-850 hover:text-blue-600 cursor-pointer block line-clamp-1 hover:underline"
                              title={book.title}
                            >
                              {book.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono italic">Location: {book.location}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-slate-700">{book.author}</div>
                          <div className="text-[10px] text-slate-400">{book.publisher} ({book.publishYear})</div>
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            book.category === 'Computer Science' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            book.category === 'Engineering' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                            book.category === 'Management' ? 'bg-purple-50 text-purple-700 border border-purple-100' :
                            book.category === 'Science' ? 'bg-cyan-50 text-cyan-700 border border-cyan-100' :
                            'bg-rose-50 text-rose-700 border border-rose-100'
                          }`}>
                            {book.category}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-mono text-[10px] text-slate-500 font-semibold">{book.isbn}</td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex flex-col items-center">
                            <span className="font-bold text-slate-800 font-mono text-sm">
                              {book.available} / <span className="text-slate-400 text-xs font-semibold">{book.copies}</span>
                            </span>
                            <span className={`text-[8.5px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                              book.available === 0 ? 'bg-red-50 text-red-600 border border-red-100' :
                              book.available < 3 ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                              'bg-emerald-50 text-emerald-700 border border-emerald-100'
                            }`}>
                              {book.available === 0 ? 'Out of Stock' : book.available < 3 ? 'Low Stock' : 'Adequate'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenDetail(book)}
                              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-blue-600 transition-colors rounded-lg cursor-pointer"
                              title="Full catalogues profile specifications"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(book)}
                              className="p-1.5 hover:bg-slate-100 text-slate-500 hover:text-amber-600 transition-colors rounded-lg cursor-pointer"
                              title="Amend catalogue characteristics"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteBook(book.id)}
                              className="p-1.5 hover:bg-rose-50 text-slate-500 hover:text-red-600 transition-colors rounded-lg cursor-pointer"
                              title="Annihilate catalog entry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Segment */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between text-xs text-slate-500" id="books-pagination-ctrls">
              <span>Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, filteredBooks.length)}</strong> of <strong>{filteredBooks.length}</strong> catalog books</span>
              
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentPage === i + 1
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer font-bold"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PANEL 2 & 3: ADD/EDIT COMPLEX Catalogs INFO FORM */}
      {(viewMode === 'add' || viewMode === 'edit') && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" id="add-edit-book-form">
          
          {/* Main Book Information (2/3 Width) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5 lg:col-span-2">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-3 block">
              Book Characteristics & Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Title input */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase block">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clean Architecture: A Craftsman's Guide to Software Structure"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  id="form-book-title-field"
                />
              </div>

              {/* Author input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase block">Primary Author</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Robert C. Martin"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase block">Academic Classification</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white cursor-pointer"
                  id="form-book-category-field"
                >
                  {categoriesList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* ISBN input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase block">ISBN-13 Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 978-0134494166"
                  value={formIsbn}
                  onChange={(e) => setFormIsbn(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono"
                />
              </div>

              {/* Publisher */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase block">Publisher House</label>
                <input
                  type="text"
                  placeholder="e.g. Addison-Wesley Professional"
                  value={formPublisher}
                  onChange={(e) => setFormPublisher(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Publication Year */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase block">Publication Year</label>
                <input
                  type="string"
                  placeholder="e.g. 2017"
                  value={formPublishYear}
                  onChange={(e) => setFormPublishYear(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono"
                />
              </div>

              {/* Total Copies */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase block">Authorized Stock (Copies)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formCopies}
                  onChange={(e) => setFormCopies(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono"
                />
              </div>

              {/* Location Shelf no */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase block">Library Placement Coordinates / Shelf No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Block CS-A, Shelf #3A-Level-2"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Description text area */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-500 uppercase block">Bibliographical Summary / Description</label>
                <textarea
                  rows={4}
                  placeholder="Write a concise overview, subject descriptors, table or indexing coordinates..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full px-3.5 py-2 border border-slate-400/20 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none leading-relaxed"
                />
              </div>

            </div>

            {/* Cancel & Save segment */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl transition-colors cursor-pointer text-xs border border-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-colors cursor-pointer text-xs"
                id="submit-book-form-ctrl"
              >
                {viewMode === 'add' ? 'Publish Catalog Entry' : 'Commit Changes'}
              </button>
            </div>
          </div>

          {/* Side cover artwork designer (1/3 Width) */}
          <div className="space-y-6">
            
            {/* Design & Preview cover card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest mb-4 text-left border-b border-slate-100 pb-2">
                Cover Artwork & Layout Designer
              </h4>

              {/* Dynamic Live Cover preview */}
              <div className="mb-6 flex justify-center">
                <div className={`w-36 h-52 rounded-xl bg-gradient-to-br ${formCoverColor} flex flex-col justify-between p-4 shadow-xl relative overflow-hidden transition-all duration-300 transform hover:rotate-2`}>
                  <div className="text-[9px] font-extrabold text-[#94A3B8] uppercase tracking-wider text-left leading-none">
                    {formCategory || 'CATEGORY'}
                  </div>
                  
                  <div className="text-xs font-black text-white text-left leading-tight line-clamp-3 my-auto">
                    {formTitle || 'Sample Title Outline Let\'s Keep It Bold'}
                  </div>

                  <div className="text-[10px] text-indigo-200 font-bold text-left truncate">
                    {formAuthor || 'Author Name'}
                  </div>

                  <div className="absolute right-2 bottom-2 text-[10px] text-white/50 font-mono">VB</div>
                </div>
              </div>

              {/* Select color gradients palette */}
              <div className="space-y-2 text-left mb-6">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Palette Theme</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    'from-[#0B1B3D] to-indigo-950',
                    'from-blue-700 to-indigo-950',
                    'from-emerald-700 to-teal-900',
                    'from-purple-700 to-fuchsia-950',
                    'from-cyan-700 to-slate-900',
                    'from-rose-700 to-red-950',
                    'from-amber-600 to-amber-950',
                    'from-slate-700 to-slate-950',
                    'from-pink-700 to-rose-950',
                    'from-violet-700 to-purple-950'
                  ].map((grad, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => selectColorVariant(grad)}
                      className={`h-7 rounded-md bg-gradient-to-br ${grad} border-2 hover:scale-110 transition-transform cursor-pointer shadow-sm ${
                        formCoverColor === grad ? 'border-blue-500 ring-2 ring-blue-100' : 'border-transparent'
                      }`}
                      title={grad}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Drag & Drop cover file zone */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-stretch text-center">
              <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest mb-3 text-left border-b border-slate-100 pb-2">
                Cover Art Upload
              </h4>

              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-5 transition-all text-xs flex flex-col items-center justify-center gap-2 cursor-pointer ${
                  dragActive 
                    ? 'border-blue-600 bg-blue-50/20' 
                    : uploadedCoverName 
                      ? 'border-emerald-500 bg-emerald-50/5' 
                      : 'border-slate-200 hover:border-slate-350 bg-slate-50/30'
                }`}
                id="book-cover-dropzone"
              >
                {uploadedCoverName ? (
                  <>
                    <div className="p-2 bg-emerald-100 rounded-full text-emerald-600 animate-bounce">
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-emerald-700">Art Asset Loaded!</span>
                    <p className="text-[10px] text-slate-400 break-all font-mono font-bold">{uploadedCoverName}</p>
                    <button 
                      type="button" 
                      onClick={() => setUploadedCoverName(null)}
                      className="text-[10px] text-red-500 font-bold hover:underline mt-1"
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-8 h-8 text-slate-450" />
                    <p className="font-semibold text-slate-600">Drag & Drop book cover art here</p>
                    <span className="text-[10px] text-slate-400">or click to browse local files</span>
                    <input
                      type="file"
                      id="file-element"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setUploadedCoverName(e.target.files[0].name);
                        }
                      }}
                    />
                    <label 
                      htmlFor="file-element" 
                      className="mt-2 px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 shadow-sm cursor-pointer"
                    >
                      Browse Files
                    </label>
                  </>
                )}
              </div>
            </div>

          </div>

        </form>
      )}

      {/* VIEW PANEL 4: CATALOG SPECS DETAIL CARD VIEW */}
      {viewMode === 'detail' && activeBook && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-fade-in" id="book-spec-detail-view">
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Book Spine presentation cover */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-44 h-64 rounded-2xl bg-gradient-to-br ${activeBook.coverColor} flex flex-col justify-between p-5 shadow-2xl relative overflow-hidden transition-all duration-300 border border-white/10`}>
                <div className="text-[10px] font-black text-indigo-200 uppercase tracking-widest leading-none">
                  {activeBook.category}
                </div>
                
                <div className="text-sm font-extrabold text-white leading-snug line-clamp-4 my-auto font-sans text-shadow">
                  {activeBook.title}
                </div>

                <div className="text-[11px] text-indigo-300 font-semibold truncate">
                  {activeBook.author}
                </div>
                <div className="absolute right-3 bottom-3 text-xs text-white/50 font-mono">VB</div>
              </div>

              {/* Status details shelf localization */}
              <div className="mt-4 text-center px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl w-full">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Catalog Location</span>
                <span className="text-xs font-extrabold text-slate-700 block font-mono bg-white inline-block px-2.5 py-1 rounded border border-slate-200 shadow-inner">
                  {activeBook.location}
                </span>
              </div>
            </div>

            {/* Catalog Info & metadata tabs */}
            <div className="flex-1 space-y-6">
              
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md inline-block mb-2">
                  {activeBook.category}
                </span>
                <h2 className="text-xl font-black text-slate-850 tracking-tight leading-snug">{activeBook.title}</h2>
                <p className="text-slate-500 font-bold text-sm mt-1">by {activeBook.author}</p>
              </div>

              {/* Stat grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Copies Borrowed</span>
                  <p className="text-base font-black text-slate-800 font-mono">{activeBook.copies - activeBook.available}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Stock Left</span>
                  <p className="text-base font-black text-slate-800 font-mono">{activeBook.available}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">ISBN ID</span>
                  <p className="text-[11px] font-black text-slate-800 font-mono truncate">{activeBook.isbn}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Public Year</span>
                  <p className="text-xs font-black text-slate-800 font-mono">{activeBook.publishYear}</p>
                </div>
              </div>

              {/* Abstract narrative text block */}
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-widest block">Narrative Abstract</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-150/50">
                  {activeBook.description}
                </p>
              </div>

              {/* Administrative metadata rows */}
              <div className="border-t border-slate-100 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-slate-400" />
                  <span>Publisher: <strong className="font-bold text-slate-850">{activeBook.publisher}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-slate-400" />
                  <span>Onboarded: <strong className="font-bold text-slate-850">2026-06-01 (Catalog system auto-date)</strong></span>
                </div>
              </div>

              {/* Actions row */}
              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(activeBook)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/10 transition-colors text-xs cursor-pointer"
                >
                  Edit Catalogue Specifications
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteBook(activeBook.id);
                    setViewMode('list');
                  }}
                  className="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-red-600 font-bold rounded-xl transition-colors text-xs cursor-pointer"
                >
                  Delete Book
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

    </div>
  );
}
