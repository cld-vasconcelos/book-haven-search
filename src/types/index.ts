export interface Book {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    description?: string;
    publishedDate?: string;
    imageLinks?: {
      thumbnail?: string;
    };
    categories?: string[];
    pageCount?: number;
    publisher?: string;
  };
}

export interface Author {
  name: string;
  books: Book[];
}