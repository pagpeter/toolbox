import tr from "deob-transformations";

export default (code, config = {}) => {
  console.log(config);
  const ast = tr.code_to_ast(code);
  if (config.replace_hex) tr.replace_hex_encoded(ast);
  tr.deobfuscate_jsfuck(ast);
  tr.constant_folding(ast);
  tr.remove_empty_statements(ast);
  tr.remove_useless_if(ast);
  tr.rewrite_inline_if(ast);
  tr.remove_dead_else(ast);
  tr.remove_comma_statements(ast);
  tr.rewrite_inline_logical_expression(ast);

  if (config.delete_unused) {
    tr.replace_with_actual_val(ast);
    tr.delete_unused(ast);
  }
  tr.deobfuscate_object_calls(ast);

  if (config.rename) {
    tr.rename_function_arguments(ast);
    tr.rename_identifiers(ast);
  }

  const out = tr.ast_to_code(ast);
  if (config.beautify) return tr.beautify_code(out);
  else return out;
};
