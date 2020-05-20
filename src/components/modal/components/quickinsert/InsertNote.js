import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import AddOther from './AddOther';
import DisplayOther from './DisplayOther';
import './insertnote.scss';

import { setAlert } from 'store/actions/alert';
import { addNote } from 'store/actions/note';

const InsertNote = ({ setAlert, addNote }) => {
  const [text, setText] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [addingTag, setAddingTag] = useState(false);
  const [selectedTag, setSelectedTag] = useState({});
  const [selectTagStep, setSelectTagStep] = useState(0);
  const [otherTags, setOtherTags] = useState([]);
  const [otherTagsIds, setOtherTagsIds] = useState([]);

  const onTextChange = (e) => {
    setText(e.target.value);
  };

  const onTagChange = async (e) => {
    const value = e.target.value.toLowerCase();

    setTag(e.target.value);
    const res = await axios.get(`/api/v1/tags/?find=${value}`);

    const resData = res.data.data;

    setTags(resData);
    if (resData.length === 1 && resData[0]) {
      // only one tag responsed
      if (resData[0].name === value) {
        selectTag(resData[0], true);
      } else {
        setSelectedTag({});
      }
    } else if (resData.length > 1) {
      // several tags responsed
      if (resData.map((tag) => tag.name).indexOf(value) !== -1) {
        if (
          resData[resData.map((tag) => tag.name).indexOf(value)].name === value
        ) {
          // the text is exactly same as tags name
          selectTag(resData[resData.map((tag) => tag.name).indexOf(value)]);
        }
      } else {
        setSelectedTag({});
      }
    } else if (resData.length === 0) {
      setSelectedTag({});
    }

    value !== '' && setAddingTag(true);

    setSelectTagStep(0);
  };

  const onTagFocus = (e) => {
    tag !== '' && setAddingTag(true);
  };

  const onTagBlur = (e) => {
    setAddingTag(false);
    tag === '' && setSelectedTag({});
    setSelectTagStep(0);
  };

  const onTagKeyUp = (e) => {
    e.preventDefault();
    if (e.keyCode === 40) {
      // arrow down pushed
      selectTagStep < tags.length && setSelectTagStep(selectTagStep + 1);
    } else if (e.keyCode === 38) {
      // arrow up pushed
      selectTagStep !== 0 && setSelectTagStep(selectTagStep - 1);
    } else if (e.keyCode === 39) {
      // arrow right pushed
      if (tags.length === 1) {
        selectTag(tags[0], true);
      }
    } else if (e.keyCode === 13) {
      if (tags.length !== 0) {
        if (tags[selectTagStep - 1]) {
          selectTag(tags[selectTagStep - 1], true);
        }
      } else if (tags.length === 0 && tag !== '') {
        createTag();
      }
      if (selectedTag._id) {
        selectTag(selectedTag, true);
      }
    }
  };

  const selectTag = (tag, clearAddingTag /* T or F */) => {
    setTag(tag.name);
    setSelectedTag(tag);
    clearAddingTag && setAddingTag(false);
    setSelectTagStep(0);

    if (otherTagsIds.indexOf(tag._id) !== -1) {
      // the tag is in other Tags list so delete it...
      const newList = otherTags.filter((t) => {
        return t._id !== tag._id;
      });

      setOther(newList);
    }
  };

  const createTag = () => {
    try {
      axios
        .post('/api/v1/tags', {
          name: tag,
          description: 'fast added tag',
        })
        .then((res) => {
          setAlert('on', `tag ${res.data.data.name} created`, 'success', 2500);
          setAddingTag(false);
          setSelectedTag(res.data.data);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const setOther = (tags) => {
    setOtherTags(tags);

    const ids = tags.map((t) => t._id);

    setOtherTagsIds(ids);
  };

  const onAddNote = async () => {
    if (selectedTag._id && text) {
      const formData = {
        body: text,
        tag: selectedTag._id,
        otherTags: otherTagsIds,
        date: new Date(),
      };
      await addNote(formData);
      setTag('');
      setText('');
      setSelectedTag({});
      setTags([]);
      setOtherTags([]);
      setOtherTagsIds([]);
    } else {
      if (text === '') {
        setAlert('on', 'note text is required', 'warning', 2500);
      } else if (!selectedTag._id) {
        setAlert('on', 'you must select or create a tag', 'warning', 2500);
      }
    }
  };

  const tagBorderColor = {
    borderColor: selectedTag.color ? selectedTag.color : '#ccc',
  };

  const tagColor = {
    color: selectedTag.color ? selectedTag.color : '#ccc',
  };

  return (
    <div className="insert-note">
      <div
        onBlur={onTagBlur}
        onFocus={onTagFocus}
        style={tagBorderColor}
        className="insert-note-tag"
        tabIndex="-1"
      >
        <span style={tagColor}>#</span>
        <input
          type="text"
          placeholder="Tag"
          style={tagColor}
          value={tag}
          onKeyUp={onTagKeyUp}
          onChange={onTagChange}
        />
        <div className={`insert-note-tag-sug ${addingTag ? 'show' : 'hide'}`}>
          {tags.length !== 0 && (
            <TagsDisplayer
              step={selectTagStep}
              tags={tags}
              select={selectTag}
            />
          )}
          {tag !== '' && tags.map((tag) => tag.name).indexOf(tag) === -1 && (
            <AddTag createTag={createTag} text={tag} />
          )}
        </div>
      </div>
      <textarea
        className="insert-note-text"
        value={text}
        onChange={onTextChange}
        placeholder="Note..."
        rows="6"
      ></textarea>
      <AddOther
        setTags={setOther}
        tags={otherTags}
        primaryTagId={selectedTag._id}
      />
      <DisplayOther setTags={setOther} tags={otherTags} />
      <input
        type="submit"
        value="➕ Add Note"
        className="insert-note-button"
        onClick={onAddNote}
      />
    </div>
  );
};

const TagsDisplayer = ({ tags, step, select }) => {
  const onClick = (tag) => {
    select(tag, true);
  };

  return (
    <>
      {tags.map((tag, index) => (
        <div
          key={tag._id}
          className={`tag-suggestion ${index + 1 === step && 'active'}`}
          onClick={() => onClick(tag)}
          style={{ background: tag.color }}
        >
          {tag.name}
        </div>
      ))}
    </>
  );
};

const AddTag = ({ text, createTag }) => {
  return (
    <div>
      create{' '}
      <div onClick={() => createTag()} className="tag-suggestion create-tag">
        {text}
      </div>
    </div>
  );
};

InsertNote.propTypes = {
  setAlert: PropTypes.func.isRequired,
};

export default connect(null, { setAlert, addNote })(InsertNote);
