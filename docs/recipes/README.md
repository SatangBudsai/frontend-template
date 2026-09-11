# Included integration guides

The template ships runnable foundations for API generation, localization, icons, server state, and global client state. These guides explain how to adopt them without weakening their boundaries.

| Foundation                       | Included path                              | External setup required?                                            |
| -------------------------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| Typed OpenAPI client             | [`openapi-codegen.md`](openapi-codegen.md) | No; replace the checked Swagger file before generation              |
| Thai/English Tolgee localization | [`tolgee.md`](tolgee.md)                   | No for bundled JSON; yes only for remote editing or synchronization |
| TanStack Query                   | [`tanstack-query.md`](tanstack-query.md)   | No; a backend is needed only when a query executes                  |
| Redux Toolkit                    | [`redux-toolkit.md`](redux-toolkit.md)     | No                                                                  |
| Iconify                          | [`iconify.md`](iconify.md)                 | No account; string icon IDs load from the public Iconify API        |

Keep dependency versions exact and run the complete quality suite after changing a contract or provider boundary.
