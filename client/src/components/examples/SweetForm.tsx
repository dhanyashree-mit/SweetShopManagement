import SweetForm from '../SweetForm';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function SweetFormExample() {
  const [open, setOpen] = useState(false);

  const categories = ['Chocolate', 'Gummies', 'Lollipops', 'Caramels', 'Hard Candy'];

  return (
    <div className="p-8 bg-background">
      <Button onClick={() => setOpen(true)}>Open Sweet Form</Button>
      <SweetForm
        open={open}
        onClose={() => setOpen(false)}
        categories={categories}
        onSubmit={(data) => {
          console.log('Form submitted:', data);
          setOpen(false);
        }}
      />
    </div>
  );
}