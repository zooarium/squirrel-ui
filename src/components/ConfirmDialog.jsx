import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';

export default function ConfirmDialog({ isOpen, message, onConfirm, onCancel }) {
  return (
    <AlertDialog.Root open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="modal-backdrop show" style={{ opacity: 0.7 }} />
        <div className="modal show d-block" style={{ zIndex: 1070 }}>
          <div className="modal-dialog modal-dialog-centered modal-sm">
            <AlertDialog.Content className="modal-content">
              <div className="modal-header">
                <AlertDialog.Title className="modal-title">Confirm</AlertDialog.Title>
              </div>
              <div className="modal-body">
                <AlertDialog.Description className="text-secondary">
                  {message}
                </AlertDialog.Description>
              </div>
              <div className="modal-footer">
                <AlertDialog.Cancel asChild>
                  <button className="btn btn-secondary" onClick={onCancel}>
                    Cancel
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button className="btn btn-danger" onClick={onConfirm}>
                    Delete
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </div>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
