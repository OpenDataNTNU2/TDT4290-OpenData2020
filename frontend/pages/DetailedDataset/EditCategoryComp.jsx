import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';

import EditIcon from '@material-ui/icons/Edit';
import SelectCategory from '../../Components/Forms/SelectCategory';
import GetApi from '../../Components/ApiCalls/GetApi';

const EditCategoryComp = (props) => {
  const host = process.env.NEXT_PUBLIC_DOTNET_HOST;

  const [editBool, setEditBool] = useState(false);
  const [editText, setEditText] = useState(props.value);

  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    GetApi(`${host}/api/categories`, setCategories);
  }, [props]);

  const updateDataset = () => {
    props.updateDataset(selectedCategory, props.path);
    getCategory(categories);
    setEditBool(false);
  };

  function getCategory(list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === selectedCategory) {
        setEditText(list[i].name);
        return;
      }
      if (list[i].narrower.length !== 0) {
        getCategory(list[i].narrower);
      }
    }
  }

  return props.canEdit ? (
    editBool ? (
      <div>
        <SelectCategory
          id="category"
          mainLabel="Kategori"
          value={categories}
          setSelectedCategory={setSelectedCategory}
          selected={selectedCategory}
        />
        <Button variant="contained" color="primary" onClick={updateDataset}>
          Lagre endring
        </Button>
      </div>
    ) : (
      <p className={props.styles}>
        <span>Kategori: </span>
        {editText} <EditIcon fontSize="small" onClick={() => setEditBool(true)} />
      </p>
    )
  ) : (
    <p className={props.styles}>
      <span>Kategori: </span>
      {editText}{' '}
    </p>
  );
};

export default EditCategoryComp;
