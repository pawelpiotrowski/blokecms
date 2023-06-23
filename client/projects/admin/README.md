# Developer Notes

## Query Params Handling in Edit/Create Views

To manage consistent user journey during creating or editing page/article there is additional data passed via route query params (see interface in `client/projects/admin/src/app/layout/page-content-entity-layout/page-content-entity-layout.interface.ts`).

### Interface

```bash
export interface PageContentEntityQueryParams {
  pageId?: string;
  parent?: 'articles' | 'pages';
  id?: string;
  new?: true;
  kind?: 'text' | 'media' | 'article';
}
```

### Logic Locations

1. Back & Save buttons in page/article/block/multimedia form views are located in:

- PageContentEntityLayoutComponent -> queryParamsHandler (back button)
- PageContentEntityFormService -> postEntitySuccessfulRequest (save button)

2. Post Edit/Create handler in page/article form views are located in

- PageFormComponent -> queryParamsHandler
- ArticleFormComponent -> queryParamsHandler

### Example Urls

_User starts with editing a page clicks add new article and saves it._

1. '/pages/PAGE_ID/edit'
2. '/articles/new?parent="pages"&id="PAGE_ID"'
3. '/pages/PAGE_ID/edit?new=true&id="ARTICLE_ID"&kind="article"'
4. '/pages/PAGE_ID/edit' (after adding new article and cleanup)

_User starts with editing a page clicks edit article and saves it._

1. '/pages/PAGE_ID/edit'
2. '/articles/ARTICLE_ID/edit?parent="pages"&id="PAGE_ID"'
3. '/pages/PAGE_ID/edit?id="ARTICLE_ID"&kind="article"'
4. '/pages/PAGE_ID/edit' (after cleanup)

_User starts with editing a page clicks edit article clicks add new block saves it and saves article._

1. '/pages/PAGE_ID/edit'
2. '/articles/ARTICLE_ID/edit?parent="pages"&id="PAGE_ID"'
3. '/blocks/new?parent="articles"&id="ARTICLE_ID"&pageId="PAGE_ID"'
4. '/articles/ARTICLE_ID/edit?new=true&id="BLOCK_ID"&kind="text"&pageId="PAGE_ID"'
5. '/articles/ARTICLE_ID/edit?parent="pages"&id="PAGE_ID"' (after cleanup in article form)
6. '/pages/PAGE_ID/edit?id="ARTICLE_ID"&kind="article"'
7. '/pages/PAGE_ID/edit' (after cleanup in page form)

_User starts with editing an article clicks add new multimedia and saves it._

1. '/articles/ARTICLE_ID/edit'
2. '/multimedia/new?parent="articles"&id="ARTICLE_ID"'
3. '/articles/ARTICLE_ID/edit?new=true&id="BLOCK_ID"&kind="media"'
4. '/articles/ARTICLE_ID/edit' (after adding new multimedia and cleanup)
