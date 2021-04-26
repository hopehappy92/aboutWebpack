module.exports = function myplugin() {
  // return {
  //   visitor: {
  //     Identifier(path) {
  //       const name = path.node.name;

  //       // babel이 만든 AST 노드 출력
  //       console.log("Identifier() name:", name);

  //       // 변환작업: 코드 문자열을 역순으로 변환
  //       path.node.name = name.split("").reverse().join("");
  //     },
  //   },
  // };

  return {
    visitor: {
      VariableDeclaration(path) {
        console.log("VariableDeclaration() kind:", path.node.kind);

        if (path.node.kind === "const") {
          path.node.kind = "let";
        }
      },
    },
  };
};
