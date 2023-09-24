import js_beautify from "js-beautify";

const tools = [
  {
    name: "b64_encode",
    title: "Base64 encoder",
    subtitle: "A simple ASCII to Base64 encoding utility",
    func: (i) => btoa(i),
    similar: ["b64_decode"],
  },
  {
    name: "b64_decoder",
    title: "Base64 decoder",
    subtitle: "A simple Base64 to text decoding utility",
    func: (i) => atob(i),
    similar: ["b64_encode"],
  },
  {
    name: "url_decoder",
    title: "URL decoder",
    subtitle: "A simple decoder for URL encoded strings",
    func: decodeURIComponent,
    similar: ["url_encoder"],
  },
  {
    name: "url_encoder",
    title: "URL encoder",
    subtitle: "A simple utility to URL-encode a string",
    func: encodeURIComponent,
    similar: ["url_decoder"],
  },
  {
    name: "rot13",
    title: "Rot13 decoder",
    subtitle: "An utility for encoding/decoding Rot13 encrypted text",
    func: (i) =>
      i.replace(/[a-z]/gi, (letter) =>
        String.fromCharCode(
          letter.charCodeAt(0) + (letter.toLowerCase() <= "m" ? 13 : -13)
        )
      ),
  },
  {
    name: "json_formatter",
    title: "JSON formatter",
    subtitle: "An utility for formatting/verifiying ugly JSON",
    func: (i) => JSON.stringify(JSON.parse(i), null, "\t"),
    similar: ["js_formatter"],
  },
  {
    name: "js_formatter",
    title: "JavaScript formatter",
    subtitle: "An utility for formatting/verifiying ugly JavaScript",
    func: (i) => js_beautify(i, { indent_size: 2, space_in_empty_paren: true }),
    similar: ["json_formatter"],
  },
  {
    name: "uuid_analyzer",
    title: "UUID analyzer",
    subtitle:
      "An utility for getting all information out of an UUID (timestamp + version)",
    similar: ["jwt_decoder"],
    func: (i) => {
      if (i.length !== 36) return "Invalid UUID";
      const blocks = i.split("-");
      if (blocks.length !== 5) return "Invalid UUID";
      const version = blocks[2][0];

      return `UUID: ${i}\n\nVersion: ${version}\nTimestamp: WIP`;
    },
  },
  {
    name: "jwt_decoder",
    title: "JWT decoder",
    subtitle: "An utility for decoding a JSON Web Token (JWT)",
    similar: ["uuid_analyzer"],
    func: (i) => {
      const meta = JSON.stringify(
        JSON.parse(atob(i.split(".")[0])),
        null,
        "\t"
      );
      const main = JSON.stringify(
        JSON.parse(atob(i.split(".")[1])),
        null,
        "\t"
      );
      return `Meta information:\n${meta}\n\nEncoded data:\n${main}`;
    },
  },
  {
    name: "header_formatter",
    title: "Header to code",
    subtitle:
      "An utility for converting raw HTTP headers (for example from charles) to a JSON object",
    similar: ["uuid_analyzer", "jwt_decoder"],
    func: (i) =>
      JSON.stringify(
        i
          .split("\n")
          .map((e) => e.split(": "))
          .filter((e) => e.length === 2 && !e[0].startsWith(":"))
          .reduce((a, v) => ({ ...a, [v[0]]: v[1] }), new Map()),
        null,
        "\t"
      ),
  },
];

export default () => {
  return tools;
};
