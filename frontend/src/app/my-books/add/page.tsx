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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddBookPage() {
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    status: 'reading',
    totalPages: '',
    currentPage: '',
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:3001/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...book,
          totalPages: parseInt(book.totalPages),
          currentPage: parseInt(book.currentPage),
        }),
      });

      if (!response.ok) {
        throw new Error('Kitap eklenemedi');
      }

      router.push('/my-books');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Yeni Kitap Ekle</CardTitle>
          <CardDescription>
            Kitap koleksiyonunuza yeni bir kitap ekleyin.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Kitap Adı</Label>
              <Input
                id="title"
                value={book.title}
                onChange={(e) =>
                  setBook({ ...book, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Yazar</Label>
              <Input
                id="author"
                value={book.author}
                onChange={(e) =>
                  setBook({ ...book, author: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Açıklama</Label>
              <textarea
                id="description"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={book.description}
                onChange={(e) =>
                  setBook({ ...book, description: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Durum</Label>
              <Select
                value={book.status}
                onValueChange={(value) =>
                  setBook({ ...book, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reading">Okunuyor</SelectItem>
                  <SelectItem value="completed">Tamamlandı</SelectItem>
                  <SelectItem value="want-to-read">Okunacak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalPages">Toplam Sayfa Sayısı</Label>
              <Input
                id="totalPages"
                type="number"
                value={book.totalPages}
                onChange={(e) =>
                  setBook({ ...book, totalPages: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPage">Mevcut Sayfa</Label>
              <Input
                id="currentPage"
                type="number"
                value={book.currentPage}
                onChange={(e) =>
                  setBook({ ...book, currentPage: e.target.value })
                }
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/my-books')}
            >
              İptal
            </Button>
            <Button type="submit">Kitabı Ekle</Button>
          </CardFooter>
        </form>
      </Card>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
}
