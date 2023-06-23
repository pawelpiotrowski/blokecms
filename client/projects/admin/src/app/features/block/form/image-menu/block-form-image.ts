import {
  type EditorState,
  NodeSelection,
  type Command,
  type Transaction,
} from 'prosemirror-state';
import { Node } from 'prosemirror-model';

export type Dispatch = (tr: Transaction) => void | null;

export interface BlockFormImageAttrs {
  alt?: string;
  title?: string;
  width?: string;
}

export class BlockFormImage {
  insert(src: string, attrs: BlockFormImageAttrs): Command {
    return (state: EditorState, dispatch?: Dispatch): boolean => {
      const { schema, tr, selection } = state;

      const type = schema.nodes['image'];
      if (!type) {
        return false;
      }

      const imageAttrs = {
        width: null,
        src,
        ...attrs,
      };

      if (
        !imageAttrs.width &&
        selection instanceof NodeSelection &&
        selection.node.type === type
      ) {
        imageAttrs.width = selection.node.attrs['width'];
      }

      const node = type.createAndFill(imageAttrs) as Node;
      tr.replaceSelectionWith(node);

      const nodeSize = tr.selection.$anchor.nodeBefore?.nodeSize as number;
      const resolvedPos = tr.doc.resolve(tr.selection.anchor - nodeSize);

      tr.setSelection(new NodeSelection(resolvedPos)).scrollIntoView();

      if (tr.docChanged) {
        dispatch?.(tr);
        return true;
      }

      return false;
    };
  }

  isActive(state: EditorState): boolean {
    const { selection } = state;
    if (selection instanceof NodeSelection) {
      return selection.node.type.name === 'image';
    }

    return false;
  }
}
