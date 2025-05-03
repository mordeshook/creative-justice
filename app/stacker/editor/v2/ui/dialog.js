"use client";

import { Dialog as HeadlessDialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export function Dialog({ open, onOpenChange, children }) {
  return (
    <Transition show={open} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-50" onClose={onOpenChange}>
        <div className="fixed inset-0 bg-black bg-opacity-25" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="transition ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="transition ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
                {children}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}
