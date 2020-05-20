import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setModal } from 'store/actions/modal';

import QuickInsert from './components/quickinsert/QuickInsert';
import AskModal from './components/askModal/AskModal';

import './style/modal.scss';

const Modal = ({ modalStatus, modalType, modalData, setModal }) => {
  const [modalClass, setModalClass] = useState('off');

  useEffect(() => {
    if (modalStatus === 'off') {
      setModalClass('go');

      setTimeout(() => {
        setModalClass('off');
      }, 290);
    } else if (modalStatus === 'on') {
      setModalClass('come');

      setTimeout(() => {
        setModalClass('on');
      }, 290);
    } else if (modalStatus === 'first-off') {
      setModalClass('off');
    }
  }, [modalStatus]);

  const onClick = (e) => {
    if (e.target.classList.contains('modal-container')) {
      closeModal();
    }
  };

  const onKeyUp = (e) => {
    if (e.keyCode === 27) {
      closeModal();
    }
  };

  const closeModal = () => {
    setModal('off');
  };

  const getModalSize = () => {
    let size = 'wide';

    switch (modalType) {
      case 'ask-modal':
        size = 'narrow';
        break;
      default:
        size = 'wide';
    }

    return size;
  };

  return (
    <div
      className={`modal-container ${modalClass}`}
      onClick={onClick}
      onKeyUp={onKeyUp}
    >
      <div className={`modal-body ${getModalSize()}`}>
        <div className="close-modal-btn" onClick={closeModal}>
          <span role="img" aria-label="x-mark">
            ✖️
          </span>
        </div>
        {modalType === 'quick-insert' && <QuickInsert />}
        {modalType === 'ask-modal' && (
          <AskModal closeModal={closeModal} data={modalData} />
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  modalStatus: PropTypes.string.isRequired,
  modalType: PropTypes.string.isRequired,
  modalData: PropTypes.object.isRequired,
  setModal: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  modalStatus: state.modal.modalStatus,
  modalType: state.modal.modalType,
  modalData: state.modal.modalData,
});

export default connect(mapStateToProps, { setModal })(Modal);
