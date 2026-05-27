import React, { useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

const SIZE_CLASS = { sm: 'modal-sm', md: '', lg: 'modal-lg', xl: 'modal-xl' };

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="modal-backdrop show" style={{ opacity: 0.7 }} />
        <div className="modal show d-block" style={{ zIndex: 1060 }}>
          <div className={`modal-dialog modal-dialog-centered ${SIZE_CLASS[size] ?? ''}`}>
            <Dialog.Content
              className="modal-content"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <div className="modal-header">
                <Dialog.Title className="modal-title">{title}</Dialog.Title>
                <Dialog.Close asChild>
                  <button className="btn-close" aria-label="Close" onClick={onClose} />
                </Dialog.Close>
              </div>
              <div className="modal-body">{children}</div>
            </Dialog.Content>
          </div>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
