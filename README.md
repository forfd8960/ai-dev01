# Project Alpha

Project Alpha 是一款用于标签化管理 Tickets 的全栈示例项目，包含 FastAPI 后端与 Vite/React 前端。仓库位于 `w1/project-alpha`，支持本地开发、自动化测试以及 GitHub Actions 持续集成。

## 技术栈
- Backend: Python 3.11, FastAPI, SQLAlchemy, Alembic, Pytest
- Frontend: React 18, TypeScript, Vite, Tailwind CSS, Radix UI, React Query, Zustand
- Database: PostgreSQL 15（开发/验证），测试默认使用 SQLite 内存库
- Tooling: Ruff、Black、ESLint、Makefile、REST Client、GitHub Actions

## 仓库结构
```
w1/project-alpha/
├── backend/           # FastAPI 服务、ORM、迁移、测试
├── frontend/          # Vite + React 单页应用
├── docs/              # REST 请求集与种子数据
├── Makefile           # 常用命令封装
└── README.md
```

## 快速开始
```bash
git clone <repo>
cd w1/project-alpha
```

### 数据库准备
```bash
createdb project_alpha_dev
createdb project_alpha_test
```

### 后端
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows 使用 .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

主要 API 可通过 `http://localhost:8000/docs` 访问 Swagger 文档。

### 前端
```bash
cd frontend
npm install
cp .env.example .env.local  # 若需要自定义 API 地址
npm run dev
```

默认前端访问地址为 `http://localhost:5173`，`VITE_API_BASE_URL` 默认为 `http://localhost:8000/api`。

## Makefile 速查
- `make backend-setup`：创建虚拟环境并安装后端依赖
- `make backend-run`：启动 FastAPI 开发服务器
- `make backend-test`：运行 Pytest 测试套件
- `make frontend-setup`：安装前端依赖
- `make frontend-run`：启动 Vite 开发服务器

## 测试与质量保障
- 后端：`pytest`、`ruff check app`、`black --check app`
- 前端：`npm run lint`、`npm run build`
- REST 验收：`docs/test.rest` 提供 VS Code REST Client 请求示例
- 种子数据：`docs/seed.sql` 可导入初始标签与 Ticket 样例

## 文档与验收
- 需求与实现计划：`specs/w1/0001-spec.md`、`specs/w1/0002-implementation-plan.md`
- 阶段总结与验收记录：`docs/final-report.md`
- 关键信息（架构、环境、常见任务）已在本 README 与最终报告中说明

## CI/CD
仓库提供 GitHub Actions 工作流（`.github/workflows/ci.yml`），在 Push/Pull Request 时自动执行：
1. 后端依赖安装、静态检查与 Pytest
2. 前端依赖安装、ESLint 检查与生产构建

## 已知限制与后续方向
- 当前为单用户模式，未实现认证/授权
- 前端测试仅覆盖静态检查，未来可补充 Vitest/Playwright 用例
- 生产部署需额外配置反向代理与持久化数据库

更多联调结果、验收用例及风险记录见 `docs/final-report.md`。
