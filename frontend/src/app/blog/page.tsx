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

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/posts');

      if (!response.ok) {
        throw new Error('Blog yazıları alınamadı');
      }

      const data = await response.json();
      setPosts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
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

      const response = await fetch('http://localhost:3001/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error('Blog yazısı oluşturulamadı');
      }

      setSuccess('Blog yazısı başarıyla oluşturuldu');
      setNewPost({ title: '', content: '' });
      fetchPosts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        window.location.href = '/login';
        return;
      }

      const response = await fetch(
        `http://localhost:3001/api/posts/${postId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Blog yazısı silinemedi');
      }

      setSuccess('Blog yazısı başarıyla silindi');
      fetchPosts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Yeni Blog Yazısı</CardTitle>
          <CardDescription>
            Yeni bir blog yazısı oluşturmak için aşağıdaki formu
            doldurun.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleCreatePost}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                value={newPost.title}
                onChange={(e) =>
                  setNewPost({ ...newPost, title: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">İçerik</Label>
              <textarea
                id="content"
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={newPost.content}
                onChange={(e) =>
                  setNewPost({ ...newPost, content: e.target.value })
                }
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Yazıyı Yayınla</Button>
          </CardFooter>
        </form>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <Card key={post._id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                {new Date(post.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">{post.content}</p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link
                href={`/blog/${post._id}`}
                className="text-blue-500 hover:underline"
              >
                Devamını Oku
              </Link>
              {post.author === localStorage.getItem('userId') && (
                <Button
                  variant="destructive"
                  onClick={() => handleDeletePost(post._id)}
                >
                  Sil
                </Button>
              )}
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
