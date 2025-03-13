import { supabase } from '@/integrations/supabase/client';
import type { ProfessorRating, ProfessorReview } from '@/integrations/supabase/types';

// Search professors
export const searchProfessors = async (query: string) => {
  try {
    // First check if the professor_ratings table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('professor_ratings')
      .select('id')
      .limit(1);
    
    // If there's an error or the table doesn't exist, return an empty array
    if (tableError || !tableExists) {
      console.warn("professor_ratings table may not exist:", tableError);
      return [];
    }
    
    // If the table exists, proceed with the query
    const { data, error } = await supabase
      .from('professor_ratings')
      .select('*')
      .ilike('professor_name', `%${query}%`)
      .order('professor_name');
    
    if (error) {
      console.error("Error searching professors:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Unexpected error in searchProfessors:", err);
    return [];
  }
};

// Get professor by ID
export const getProfessor = async (id: string) => {
  try {
    // First check if the professor_ratings table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('professor_ratings')
      .select('id')
      .limit(1);
    
    // If there's an error or the table doesn't exist, return null
    if (tableError || !tableExists) {
      console.warn("professor_ratings table may not exist:", tableError);
      return null;
    }
    
    // If the table exists, proceed with the query
    const { data, error } = await supabase
      .from('professor_ratings')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching professor:", error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error("Unexpected error in getProfessor:", err);
    return null;
  }
};

// Get reviews for a professor
export const getProfessorReviews = async (professorId: string) => {
  try {
    // First check if the professor_reviews table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('professor_reviews')
      .select('id')
      .limit(1);
    
    // If there's an error or the table doesn't exist, return an empty array
    if (tableError || !tableExists) {
      console.warn("professor_reviews table may not exist:", tableError);
      return [];
    }
    
    // If the table exists, proceed with the query
    const { data, error } = await supabase
      .from('professor_reviews')
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq('professor_id', professorId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching professor reviews:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Unexpected error in getProfessorReviews:", err);
    return [];
  }
};

// Add a new professor if they don't exist
export const addProfessor = async (professor: Omit<ProfessorRating, 'id' | 'num_ratings' | 'average_rating' | 'created_at' | 'updated_at'>) => {
  // Check if professor already exists
  const { data: existingProf } = await supabase
    .from('professor_ratings')
    .select('id')
    .eq('professor_name', professor.professor_name)
    .eq('school', professor.school)
    .single();
  
  if (existingProf) return existingProf.id;
  
  // Add new professor
  const { data, error } = await supabase
    .from('professor_ratings')
    .insert({
      ...professor,
      num_ratings: 0,
      average_rating: 0
    })
    .select('id')
    .single();
  
  if (error) throw error;
  return data.id;
};

// Add a review
export const addReview = async (review: {
  professor_name: string;
  major: string;
  school: string;
  course: string;
  rating: number;
  review: string;
  difficulty: number;
}) => {
  const { professor_name, major, school, course, rating, review: reviewText, difficulty } = review;
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User not authenticated');
  
  // Add or get professor
  const professorId = await addProfessor({
    professor_name,
    major,
    school,
    difficulty
  });
  
  // Add review
  const { error } = await supabase
    .from('professor_reviews')
    .insert({
      professor_id: professorId,
      user_id: user.id,
      course,
      rating,
      review: reviewText
    });
  
  if (error) throw error;
  
  // Update professor ratings (in a transaction ideally, but we'll do it sequentially)
  const { data: profData, error: profError } = await supabase
    .from('professor_ratings')
    .select('num_ratings, average_rating')
    .eq('id', professorId)
    .single();
  
  if (profError) throw profError;
  
  const newNumRatings = profData.num_ratings + 1;
  const newAvgRating = ((profData.average_rating * profData.num_ratings) + rating) / newNumRatings;
  
  const { error: updateError } = await supabase
    .from('professor_ratings')
    .update({
      num_ratings: newNumRatings,
      average_rating: newAvgRating,
      updated_at: new Date().toISOString()
    })
    .eq('id', professorId);
  
  if (updateError) throw updateError;
  
  return { success: true, professorId };
};

// Get recent reviews
export const getRecentReviews = async (limit = 5) => {
  try {
    // First check if the professor_reviews table exists
    const { data: tableExists, error: tableError } = await supabase
      .from('professor_reviews')
      .select('id')
      .limit(1);
    
    // If there's an error or the table doesn't exist, return an empty array
    if (tableError || !tableExists) {
      console.warn("professor_reviews table may not exist:", tableError);
      return [];
    }
    
    // If the table exists, proceed with the query
    const { data, error } = await supabase
      .from('professor_reviews')
      .select(`
        *,
        professor:professor_id (
          professor_name,
          major,
          school
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching reviews:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Unexpected error in getRecentReviews:", err);
    return [];
  }
};

// Get all professors with pagination
export const getAllProfessors = async (page = 1, pageSize = 10, sortOption = 'name-asc', filterMajor = 'all', filterSchool = 'all') => {
  try {
    // Calculate the range for pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // Start building the query
    let query = supabase
      .from('professor_ratings')
      .select('*', { count: 'exact' });
    
    // Apply filters
    if (filterMajor !== 'all') {
      query = query.eq('major', filterMajor);
    }
    
    if (filterSchool !== 'all') {
      query = query.eq('school', filterSchool);
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'name-asc':
        query = query.order('professor_name', { ascending: true });
        break;
      case 'name-desc':
        query = query.order('professor_name', { ascending: false });
        break;
      case 'rating-high':
        query = query.order('average_rating', { ascending: false });
        break;
      case 'rating-low':
        query = query.order('average_rating', { ascending: true });
        break;
      case 'difficulty-high':
        query = query.order('difficulty', { ascending: false });
        break;
      case 'difficulty-low':
        query = query.order('difficulty', { ascending: true });
        break;
      case 'reviews':
        query = query.order('num_ratings', { ascending: false });
        break;
      default:
        query = query.order('professor_name', { ascending: true });
    }
    
    // Apply pagination
    query = query.range(from, to);
    
    // Execute the query
    const { data, error, count } = await query;
    
    if (error) {
      console.error("Error fetching professors:", error);
      return { professors: [], totalCount: 0 };
    }
    
    return { 
      professors: data || [], 
      totalCount: count || 0,
      totalPages: count ? Math.ceil(count / pageSize) : 0,
      currentPage: page
    };
  } catch (err) {
    console.error("Unexpected error in getAllProfessors:", err);
    return { professors: [], totalCount: 0, totalPages: 0, currentPage: 1 };
  }
};
