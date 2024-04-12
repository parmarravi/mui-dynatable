import PropTypes from 'prop-types';
/**
 * Renders a delete confirmation dialog.
 *
 * @param {object} props - The props for the component.
 * @param {string} props.msg - Optional custom message to display.
 * @param {boolean} props.showDeleteConfirmation - Whether to show the dialog.
 * @param {Function} props.deleteCallback - Callback when delete is confirmed.
 * @param {Function} props.cancelCallback - Callback when delete is canceled.
 */
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

function DeleteDialogConfirmation({ msg, showDeleteConfirmation = false, deleteCallback = () => {}, cancelCallback = () => {} }) {
    return (
        <Dialog open={showDeleteConfirmation} aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
            <DialogTitle id="delete-dialog-title" sx={{ fontSize: 18 }}>
                Delete
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="delete-dialog-description">{msg || 'Do you want to Delete the data?'}</DialogContentText>
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center' }}>
                <Button onClick={cancelCallback} sx={{ color: 'black' }}>
                    No
                </Button>
                <Button onClick={deleteCallback} sx={{ color: 'red' }}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}

DeleteDialogConfirmation.propTypes = {
    msg: PropTypes.string,
    showDeleteConfirmation: PropTypes.bool,
    deleteCallback: PropTypes.func,
    cancelCallback: PropTypes.func
};

export default DeleteDialogConfirmation;
