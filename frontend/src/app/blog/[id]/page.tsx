import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/posts/${params.id}`
      );

      if (!response.ok) {
        throw new Error('Blog yazısı bulunamadı');
      }

      const data = await response.json();
      setPost(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');

      if (!token || !userId) {
        router.push('/login');
        return;
      }

      const response = await fetch(
        `http://localhost:3001/api/posts/${params.id}`,
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

      router.push('/blog');
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded">
          Blog yazısı bulunamadı.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{post.title}</CardTitle>
          <CardDescription>
            {new Date(post.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none">
            {post.content.split('\n').map((paragraph: string, i: number) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </CardContent>
        {post.author === localStorage.getItem('userId') && (
          <CardFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Bu Yazıyı Sil
            </Button>
          </CardFooter>
        )}
      </Card>

      <div className="mt-4">
        <Button
          variant="outline"
          onClick={() => router.push('/blog')}
        >
          Blog Listesine Dön
        </Button>
      </div>
    </div>
  );
}
