"""Ticket API 集成测试。"""
import pytest


@pytest.fixture()
def base_ticket_payload():
    return {
        "title": "Implement backend",
        "description": "Finish FastAPI routes",
        "priority": "high",
    }


def test_ticket_crud_flow(client, base_ticket_payload):
    # 创建 Ticket
    response = client.post("/api/tickets", json=base_ticket_payload)
    assert response.status_code == 201
    data = response.json()
    ticket_id = data["data"]["id"]
    assert data["data"]["title"] == base_ticket_payload["title"]

    # 获取详情
    detail = client.get(f"/api/tickets/{ticket_id}")
    assert detail.status_code == 200
    assert detail.json()["data"]["id"] == ticket_id

    # 更新 Ticket
    update_payload = {"title": "Implement backend v2", "priority": "medium"}
    update_response = client.put(f"/api/tickets/{ticket_id}", json=update_payload)
    assert update_response.status_code == 200
    assert update_response.json()["data"]["priority"] == "medium"

    # 切换状态
    status_response = client.patch(
        f"/api/tickets/{ticket_id}/status", json={"status": "completed"}
    )
    assert status_response.status_code == 200
    assert status_response.json()["data"]["status"] == "completed"

    # 绑定标签
    tag_payload = {"tag_names": ["backend", "fastapi"]}
    tag_response = client.post(f"/api/tickets/{ticket_id}/tags", json=tag_payload)
    assert tag_response.status_code == 200
    tag_names = {tag["name"] for tag in tag_response.json()["data"]}
    assert tag_names == {"backend", "fastapi"}

    # 标签筛选列表
    list_response = client.get("/api/tickets", params={"tags": "backend"})
    assert list_response.status_code == 200
    assert list_response.json()["data"]["items"]

    # 搜索
    search_response = client.get("/api/tickets/search", params={"q": "backend"})
    assert search_response.status_code == 200
    assert search_response.json()["data"]["items"]

    # 删除标签
    tag_id = tag_response.json()["data"][0]["id"]
    remove_tag_response = client.delete(f"/api/tickets/{ticket_id}/tags/{tag_id}")
    assert remove_tag_response.status_code == 200
    remaining_tags = remove_tag_response.json()["data"]
    assert all(tag["id"] != tag_id for tag in remaining_tags)

    # 删除 Ticket
    delete_response = client.delete(f"/api/tickets/{ticket_id}")
    assert delete_response.status_code == 200
    assert delete_response.json()["data"]["deleted"] is True


def test_ticket_batch_delete(client, base_ticket_payload):
    # 创建多条 Ticket
    ids = []
    for idx in range(3):
        payload = dict(base_ticket_payload)
        payload["title"] = f"Ticket {idx}"
        response = client.post("/api/tickets", json=payload)
        assert response.status_code == 201
        ids.append(response.json()["data"]["id"])

    batch_response = client.delete("/api/tickets/batch", json={"ids": ids})
    assert batch_response.status_code == 200
    assert batch_response.json()["data"]["deleted"] == len(ids)
