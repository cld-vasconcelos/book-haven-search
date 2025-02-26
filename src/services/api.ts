import axios from 'axios';
import { Book } from '../types';

const API_URL = 'https://www.googleapis.com/books/v1/volumes';

export const searchBooks = async (query: string): Promise<Book[]> => {
  try {
    const response = await axios.get(`${API_URL}?q=${query}&maxResults=40`);
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

export const getBookById = async (id: string): Promise<Book | null> => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book:', error);
    return null;
  }
};

export const getAuthorBooks = async (authorName: string): Promise<Book[]> => {
  try {
    const response = await axios.get(`${API_URL}?q=inauthor:"${authorName}"&maxResults=40`);
    return response.data.items || [];
  } catch (error) {
    console.error('Error fetching author books:', error);
    return [];
  }
};