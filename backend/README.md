# Project Alpha Backend

本目录用于存放 FastAPI 后端代码。当前处于 Phase 1，已完成基础设施搭建。

## 结构规划
```
backend/
├── app/                # FastAPI 应用（Phase 2 开始实现）
├── requirements.txt    # Python 依赖
├── .env.example        # 环境变量示例
└── README.md
```

## 环境准备
1. 创建虚拟环境并安装依赖：
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Windows 使用 .venv\\Scripts\\activate
   pip install -r requirements.txt
   ```
2. 复制环境变量示例文件：
   ```bash
   cp .env.example .env
   ```
3. 后续阶段将通过 Alembic 管理数据库迁移并实现 FastAPI 应用入口。

## 已完成事项（Phase 2）
- `app/` 目录结构及核心模块（配置、模型、路由、服务）。
- Alembic 初始化以及首个迁移脚本。
- Ticket/Tag REST API 与统一响应格式。
- 基础集成测试（pytest + TestClient）。

## 常用命令
- 运行数据库迁移：`make backend-migrate`
- 启动开发服务：`make backend-run`
- 代码检查：`make backend-lint`
- 运行测试：`make backend-test`

## 下一阶段
- 结合前端实现进行联调。
- 扩充更多测试用例与错误处理场景。
- 根据需要补充日志、监控等横切能力。
