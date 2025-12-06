# Project Alpha - Phase 4 Final Report

## 1. Scope & Deliverables
- Full-stack ticket management tool with FastAPI backend and Vite/React frontend.
- REST API covering ticket CRUD, tag association, filtering, pagination, and search.
- Frontend dashboard with ticket list, filters, dialogs, optimistic updates, and toast feedback.
- Database migrations, seed data (`docs/seed.sql`), and REST request collection (`docs/test.rest`).
- Makefile helpers for setup, execution, and backend testing.

## 2. Environment & Configuration
- Python 3.11 virtual environment (`backend/.venv`) with dependencies from `backend/requirements.txt`.
- Node.js 20.x with npm 10.x; `frontend/.env.example` provides default API base URL.
- Default databases: `project_alpha_dev`, `project_alpha_test`; automated tests fall back to SQLite in-memory when `TEST_DATABASE_URL` 未配置。
- CORS default origin: `http://localhost:5173`.

## 3. Automated Test Evidence
- `pytest` (backend) – covers ticket lifecycle, tag constraints, search/filtering, pagination, and service error handling.
- `ruff check app` & `black --check app` – enforce Python style and linting.
- `npm run lint` – ESLint coverage for TypeScript/React codebase.
- `npm run build` – validates production build pipeline for frontend assets.

## 4. Manual Acceptance Summary
| 用例 | 描述 | 结果 |
| ---- | ---- | ---- |
| UC01 | 创建 Ticket 并查看详情 | 通过 |
| UC02 | 编辑 Ticket 更新标题/描述/优先级 | 通过 |
| UC03 | 删除 Ticket 并确认列表同步 | 通过 |
| UC04 | 绑定/解绑标签并按标签筛选 | 通过 |
| UC05 | 标题搜索与标签筛选组合查询 | 通过 |
| UC06 | 切换完成状态并观察 UI/后端一致性 | 通过 |

所有验收用例均在本地联调环境（FastAPI + Vite dev server）通过验证。

## 5. CI/CD
- GitHub Actions workflow `ci.yml`（触发条件：push、pull_request）。
- Job `backend`: 安装 Python 依赖，运行 `ruff`, `black`, `pytest`。
- Job `frontend`: 安装 Node 依赖，执行 `npm run lint`, `npm run build`。
- Artifact caching via `actions/setup-python` and `actions/setup-node` caches pip/npm modules to speed up连续构建。

## 6. Known Issues & Follow-ups
- 项目采用单用户模式，未来若扩展多用户需新增认证授权模块。
- 前端尚未引入单元/E2E 测试框架（例如 Vitest、Playwright）；推荐后续补充关键组件测试。
- 生产部署需配置持久化数据库与反向代理（Nginx/Caddy）并调整环境变量。

## 7. References
- 需求文档：`specs/w1/0001-spec.md`
- 实现计划：`specs/w1/0002-implementation-plan.md`
- 项目 README：`w1/project-alpha/README.md`
- REST 集合：`w1/project-alpha/docs/test.rest`
- 种子数据：`w1/project-alpha/docs/seed.sql`
