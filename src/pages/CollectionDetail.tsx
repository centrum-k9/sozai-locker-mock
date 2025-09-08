import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAnalytics } from '@/hooks/useAnalytics';
import { collectionApi } from '@/services/mockClient';
import { Collection } from '@/core/types';

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [collection, setCollection] = useState<Collection | null>(null);
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView('collection-detail');
    if (id) {
      loadCollection(id);
    }
  }, [id, trackPageView]);

  const loadCollection = async (collectionId: string) => {
    try {
      const data = await collectionApi.get(collectionId);
      setCollection(data);
    } catch (error) {
      console.error('Failed to load collection:', error);
    }
  };

  if (!collection) {
    return <div className="container py-8">Loading...</div>;
  }

  return (
    <div className="container py-8">
      <Card>
        <CardHeader>
          <CardTitle>{collection.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{collection.description}</p>
          <p>Items: {collection.itemIds.length}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CollectionDetail;