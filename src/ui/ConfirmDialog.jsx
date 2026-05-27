import React from 'react';
import * as AlertDialog from '@radix-ui/react-alert-dialog';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmLabel = 'Delete',
  confirmVariant = 'danger',
}) {
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
                  <Button variant="secondary" onClick={onCancel}>
                    Cancel
                  </Button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <Button variant={confirmVariant} onClick={onConfirm}>
                    {confirmLabel}
                  </Button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </div>
        </div>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
