# Project Alpha

Project Alpha 是一个标签化 Ticket 管理工具。本仓库包含后端 FastAPI 服务与前端 Vite/React 应用的源码，所有代码位于 `w1/project-alpha` 目录下。

## 环境要求
- Python 3.11
- Node.js 20.x 与 npm 10.x
- PostgreSQL 15（本地安装即可）

## 目录结构
```
w1/project-alpha/
├── backend/    # 后端 FastAPI 服务代码
├── frontend/   # 前端 Vite + React 应用
└── README.md
```

## 初次准备
1. 克隆仓库并进入 `w1/project-alpha` 目录。
2. 安装 PostgreSQL 并创建开发与测试数据库：
   ```bash
   createdb project_alpha_dev
   createdb project_alpha_test
   ```
3. 复制环境变量示例文件并更新本地配置（详见 backend/.env.example）。

## 后端快速开始
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows 使用 .venv\\Scripts\\activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

## 前端快速开始
后续阶段将通过 Vite 初始化 React 项目：
```bash
cd frontend
npm install
npm run dev
```
> 注：前端项目将在 Phase 2 完整初始化。
## 质量保障
- 后端代码规范：Black、Ruff、Pytest（配置详见 `backend/requirements.txt`）。
- 前端代码规范：ESLint、Prettier、Vitest（待初始化）。

## 后续步骤
- Phase 3: 构建前端界面与状态管理。
- Phase 4: 联调、验收与文档完善。
