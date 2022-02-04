import React from 'react';
import { Category } from 'src/types';
import { Button } from '@mui/material';

interface CategoryListProps {
  list: Category[];
  onCategoryClick(id: string): void;
}

export const CategoryList = ({ list, onCategoryClick }: CategoryListProps) => {
  return (
    <>
      {
        list.map((category: Category) => <Button key={category.id} variant='contained' onClick={() => {onCategoryClick(category.id)}}>{category.id}</Button>)
      }
    </>
  )
}