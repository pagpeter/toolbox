import tr from "deob-transformations";

export default (code, config = {}) => {
  const ast = tr.code_to_ast(code);
  if (config.replace_hex) {
    try {
      tr.replace_hex_encoded(ast);
    } catch (e) {
      console.log("jsdeob error:", e);
    }
  }

  try {
    tr.deobfuscate_jsfuck(ast);
  } catch (e) {
    console.log("jsdeob error:", e);
  }
  try {
    tr.constant_folding(ast);
  } catch (e) {
    console.log("jsdeob error:", e);
  }
  try {
    tr.remove_empty_statements(ast);
  } catch (e) {
    console.log("jsdeob error:", e);
  }
  try {
    tr.remove_useless_if(ast);
  } catch (e) {
    console.log("jsdeob error:", e);
  }
  try {
    tr.remove_dead_else(ast);
  } catch (e) {
    console.log("jsdeob error:", e);
  }
  try {
    tr.remove_comma_statements(ast);
  } catch (e) {
    console.log("jsdeob error:", e);
  }
  try {
    tr.rewrite_inline_logical_expression(ast);
  } catch (e) {
    console.log("jsdeob error:", e);
  }

  if (config.delete_unused) {
    try {
      tr.replace_with_actual_val(ast);
    } catch (e) {
      console.log("jsdeob error:", e);
    }
    try {
      tr.delete_unused(ast);
    } catch (e) {
      console.log("jsdeob error:", e);
    }
  }
  try {
    tr.deobfuscate_object_calls(ast);
  } catch (e) {
    console.log("jsdeob error:", e);
  }

  if (config.rename) {
    try {
      tr.rename_function_arguments(ast);
    } catch (e) {
      console.log("jsdeob error:", e);
    }
    try {
      tr.rename_identifiers(ast);
    } catch (e) {
      console.log("jsdeob error:", e);
    }
  }

  const out = tr.ast_to_code(ast);
  if (config.beautify) return tr.beautify_code(out);
  else return out;
};
