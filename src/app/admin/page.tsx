
'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { contentData, type Content } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { logout } from './login/actions';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [newContent, setNewContent] = useState<Partial<Content>>({ type: 'movie' });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewContent(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: 'movie' | 'tv') => {
    setNewContent(prev => ({ ...prev, type: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would be a server action to save the data.
    // For this prototype, we'll just show a notification.
    console.log('Submitting new content:', newContent);
    toast({
      title: 'Content Submitted (Simulated)',
      description: 'In a real app, this would be saved to a database.',
    });
    // Here you would typically clear the form
    // setNewContent({ type: 'movie' });
  };
  
  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const filteredContent = contentData.filter(content =>
    content.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Admin Panel</h1>
            <Button variant="outline" onClick={handleLogout}>Log Out</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Add New Content</CardTitle>
                <CardDescription>Fill out the form to add a new movie or TV show.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input name="id" placeholder="ID (e.g., 'new-movie')" onChange={handleInputChange} required />
                  <Input name="title" placeholder="Title" onChange={handleInputChange} required />
                  <Textarea name="description" placeholder="Description" onChange={handleInputChange} required />
                  <Input name="category" placeholder="Category (e.g., 'Action')" onChange={handleInputChange} required />
                  <Input name="thumbnailUrl" placeholder="Thumbnail URL" onChange={handleInputChange} required />
                  <Select onValueChange={handleSelectChange} defaultValue="movie">
                    <SelectTrigger>
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="movie">Movie</SelectItem>
                      <SelectItem value="tv">TV Show</SelectItem>
                    </SelectContent>
                  </Select>
                  {newContent.type === 'movie' && (
                    <Input name="videoUrl" placeholder="Video URL" onChange={handleInputChange} />
                  )}
                  {newContent.type === 'tv' && (
                    <p className="text-sm text-muted-foreground">
                      TV show episode management would be added here.
                    </p>
                  )}
                  <Button type="submit" className="w-full">Add Content</Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Existing Content</CardTitle>
                <CardDescription>A list of all content currently in the library.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                    {filteredContent.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                                <p className="font-bold">{item.title}</p>
                                <p className="text-sm text-muted-foreground">{item.category} &middot; {item.type.toUpperCase()}</p>
                            </div>
                            <Button variant="outline" size="sm">Manage</Button>
                        </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
