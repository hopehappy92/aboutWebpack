app.get("/api/keywords", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*"); // 헤더를 추가한다
  res.json(keywords);
});
