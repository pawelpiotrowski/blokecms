import { actionsFactory } from '@ngneat/effects';

// We recommend using the actions factory to prefix each action
// for better readability and debug purposes when using redux dev tools
export const pageContentEntityActions = actionsFactory('PageContentEntity');

// We can declare an action by passing it a type and an optional payload.

// Back button
export const pageContentEntityDisableBackButton =
  pageContentEntityActions.create('Disable Back Button');
export const pageContentEntityEnableBackButton =
  pageContentEntityActions.create('Enable Back Button');
// Create button
export const pageContentEntityDisableCreateButton =
  pageContentEntityActions.create('Disable Create Button');
export const pageContentEntityEnableCreateButton =
  pageContentEntityActions.create('Enable Create Button');
// Edit button
export const pageContentEntityDisableEditButton =
  pageContentEntityActions.create('Disable Edit Button');
export const pageContentEntityEnableEditButton =
  pageContentEntityActions.create('Enable Edit Button');
// Delete button
export const pageContentEntityDisableDeleteButton =
  pageContentEntityActions.create('Disable Delete Button');
export const pageContentEntityEnableDeleteButton =
  pageContentEntityActions.create('Enable Delete Button');
// Save button
export const pageContentEntityDisableSaveButton =
  pageContentEntityActions.create('Disable Save Button');
export const pageContentEntityEnableSaveButton =
  pageContentEntityActions.create('Enable Save Button');
// Reset button
export const pageContentEntityDisableResetButton =
  pageContentEntityActions.create('Disable Reset Button');
export const pageContentEntityEnableResetButton =
  pageContentEntityActions.create('Enable Reset Button');
