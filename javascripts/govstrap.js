'use strict';

import $ from 'jquery';
import AddAnother from './addanother';
import RadioHide from './radiohide';
import Edit from './edit';
import SearchBar from './searchbar';
import SelectionButton from './selectionbutton';
import Tabs from './tabs';
import Autocomplete from './autocomplete';


$('.js-add-another').each((index, element) => {
  new AddAnother(element);
});

$('.js-hidden-edit').each((index, element) => {
  new Edit(element);
});

$('.js-radiohide').each((index, element) => {
  new RadioHide(element);
});

new SearchBar('js-searchbar');
$('.searchbar').each((index, element) => {
  new SearchBar(element);
});

$(':radio').each((index,element) => {
  new SelectionButton(element);
});

new Tabs('.js-tabs');

$('.js-autocomplete').each((index, element) => {
  new Autocomplete(element);
});
