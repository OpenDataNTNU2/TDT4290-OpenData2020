import { Checkbox, FormControl, FormControlLabel, FormGroup } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';

import GetApi from '../ApiCalls/GetApi';
import capitalize from '../../utils/helperFunctions';

import styles from '../../styles/Filters.module.css';

export default function FilterPublisher(props) {
  const host = process.env.NEXT_PUBLIC_DOTNET_HOST;

  const [addedFilters, setAddedFilters] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [showItems, setShowItems] = useState(5);

  const [res, setRes] = useState({});

  /**
 * Adds the publisher id of the selected publisher and sends it to props.setUrl
 * @param {event} event - The id of the publisher checked
 */
  const handleChange = (event) => {
    const newArr = addedFilters;
    newArr.push(event.target.value);
    for (let i = 0; i < newArr.length - 1; i += 1) {
      if (newArr[i] === event.target.value) {
        newArr.pop();
        newArr.splice(i, 1);
      }
    }
    setAddedFilters(newArr);
    let newUrlString = '';
    for (let i = 0; i < newArr.length; i += 1) {
      newUrlString += `${newArr[i]},`;
    }
    props.setUrl(newUrlString);
  };

  /**
   * runs when the component mounts
   * fetch all publishers and setPublishers
   */
  useEffect(() => {
    GetApi(`${host}/api/publishers`, setRes);
    const pubs = mapResponseToPublishers(res, props.type);
    setPublishers(pubs);
    if (res.length < 5) {
      setShowItems(res.length);
    }
  }, [props]);

  /**
   * displays the amount of publishers  from @const {int} showItems  
   */
  const items = publishers
    .slice(0, showItems)
    .map((pub) => (
      <FormControlLabel
        key={pub.id}
        control={<Checkbox value={pub.id} onChange={handleChange} name={pub.name} />}
        label={`${capitalize(pub.name)} (${pub.count})`}
      />
    ));

  return (
    <div className={styles.filterContainer}>
      <FormControl>
        <h4 className={styles.filterTitle}>Kommune</h4>
        <FormGroup className={styles.checkboxesContainer}>
          <br />
          {items}
          {showItems === 5 ? (
            <ExpandMoreIcon
              style={{ cursor: 'pointer' }}
              onClick={() => setShowItems(publishers.length)}
              fontSize="large"
            />
          ) : publishers.length > 5 ? (
            <ExpandLessIcon style={{ cursor: 'pointer' }} onClick={() => setShowItems(5)} fontSize="large" />
          ) : null}
        </FormGroup>
      </FormControl>
    </div>
  );
}

/**
 *  map the response to publishers. Only adds publishers if they have content in type
 * @param {*} res - response from the Get request, datasets or coordinations
 * @param {string} type - which type of result are searched for when filtering
 */
export function mapResponseToPublishers(res, type) {
  if (JSON.stringify(res) === '{}') return [];
  let pubs = res
    .map((entry) => {
      let count;
      switch (type) {
        case 'datasets':
          count = entry.datasetsCount;
          break;
        case 'coordinations':
          count = entry.coordinationsCount;
          break;
        case 'both':
        default:
          count = entry.datasetsCount + entry.coordinationsCount;
      }
      return {
        name: entry.name.split(' ')[0],
        id: entry.id,
        count: count,
      };
    })
    .filter((entry) => entry.count > 0);
  return pubs;
}
