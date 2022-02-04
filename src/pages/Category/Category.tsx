import React from 'react';
import { Category as CategoryProps } from 'src/types';
import { Paper, Button } from '@mui/material';
import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { CategoryList } from 'src/components';

const categoryList = require('src/category.json');

const styles = {
  container: css`
    display: grid;
    grid-gap: 12px;
    grid-template-columns: repeat(4, 1fr);
    padding: 12px;
    height: 100%;
  `
}

export const Category = () => {
  const navigator = useNavigate();
  const handleCategoryClick = (categoryId: string) => {
    const category = categoryList.find((category: CategoryProps) => {
      return category.id === categoryId;
    });
    console.log('category', category);
    navigator('/subCategory', { state: { title: category.id, subCategoryList: category.list} })
  }
  return(
    <Paper css={styles.container} elevation={2}>
      <CategoryList list={categoryList} onCategoryClick={handleCategoryClick} />
    </Paper>
  )
}
