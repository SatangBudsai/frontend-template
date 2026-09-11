# Included integration guides

The template ships runnable, offline-safe foundations for both integrations. These guides explain how to replace the examples with project-owned services without weakening their boundaries.

| Foundation                       | Included path                              | External setup required?                                            |
| -------------------------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| Typed OpenAPI client             | [`openapi-codegen.md`](openapi-codegen.md) | No; replace the checked Swagger file before generation              |
| Thai/English Tolgee localization | [`tolgee.md`](tolgee.md)                   | No for bundled JSON; yes only for remote editing or synchronization |

Keep dependency versions exact and run the complete quality suite after changing either contract.
