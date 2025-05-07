import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function MyBooksPage() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    status: 'reading', // reading, completed, want-to-read
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://localhost:3001/api/books', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Kitaplar alınamadı');
      }

      const data = await response.json();
      setBooks(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch('http://localhost:3001/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newBook),
      });

      if (!response.ok) {
        throw new Error('Kitap eklenemedi');
      }

      setSuccess('Kitap başarıyla eklendi');
      setNewBook({
        title: '',
        author: '',
        description: '',
        status: 'reading',
      });
      fetchBooks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeleteBook = async (bookId: string) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(
        `http://localhost:3001/api/books/${bookId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Kitap silinemedi');
      }

      setSuccess('Kitap başarıyla silindi');
      fetchBooks();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'reading':
        return 'text-blue-500';
      case 'completed':
        return 'text-green-500';
      case 'want-to-read':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'reading':
        return 'Okunuyor';
      case 'completed':
        return 'Tamamlandı';
      case 'want-to-read':
        return 'Okunacak';
      default:
        return status;
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kitaplarım</h1>
        <Link href="/my-books/add">
          <Button>Yeni Kitap Ekle</Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {books.map((book: any) => (
          <Card key={book._id}>
            <CardHeader>
              <CardTitle>{book.title}</CardTitle>
              <CardDescription>{book.author}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">{book.description}</p>
              <p
                className={`mt-2 font-semibold ${getStatusColor(
                  book.status
                )}`}
              >
                {getStatusText(book.status)}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link
                href={`/my-books/${book._id}`}
                className="text-blue-500 hover:underline"
              >
                Detaylar
              </Link>
              <Button
                variant="destructive"
                onClick={() => handleDeleteBook(book._id)}
              >
                Sil
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
    </div>
  );
}
