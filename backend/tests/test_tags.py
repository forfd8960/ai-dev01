"""标签 API 测试。"""

def test_list_tags(client):
    # 先创建 Ticket 并绑定标签，确保有使用次数
    create_response = client.post(
        "/api/tickets",
        json={"title": "Tag seed", "description": "", "priority": "low"},
    )
    ticket_id = create_response.json()["data"]["id"]
    client.post(
        f"/api/tickets/{ticket_id}/tags",
        json={"tag_names": ["backend", "database"]},
    )

    response = client.get("/api/tags", params={"sort": "usage_desc"})
    assert response.status_code == 200
    tag_data = response.json()["data"]
    assert len(tag_data) >= 2
    assert {tag["name"] for tag in tag_data} >= {"backend", "database"}
