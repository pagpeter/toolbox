const stringArrayNoatation = (arr) => arr.map((e) => `"${e}"`).join(", ");
const stringArrayNoatationIndent = (arr, startAt) => "\n" + "\t".repeat(startAt) + arr.map((e) => `"${e}"`).join(`,\n${"\t".repeat(startAt)}`) + ",\n" + "\t".repeat(startAt - 1);
const expressionIndent = (arr, startAt) => "\n" + "\t".repeat(startAt) + arr.join(`,\n${"\t".repeat(startAt)}`) + ",\n" + "\t".repeat(startAt - 1);

const h2SettingsMapping = {
  HEADER_TABLE_SIZE: "http2.SettingHeaderTableSize",
  ENABLE_PUSH: "http2.SettingEnablePush",
  MAX_CONCURRENT_STREAMS: "http2.SettingMaxConcurrentStreams",
  INITIAL_WINDOW_SIZE: "http2.SettingInitialWindowSize",
  MAX_HEADER_LIST_SIZE: "http2.SettingMaxHeaderListSize",
};

const signatureSchemeMapping = {
  ecdsa_secp256r1_sha256: "tls.ECDSAWithP256AndSHA256",
  rsa_pss_rsae_sha256: "tls.PSSWithSHA256",
  rsa_pkcs1_sha256: "tls.PKCS1WithSHA256",
  ecdsa_secp384r1_sha384: "tls.ECDSAWithP384AndSHA384",
  rsa_pss_rsae_sha384: "tls.PSSWithSHA384",
  rsa_pkcs1_sha384: "tls.PKCS1WithSHA384",
  rsa_pss_rsae_sha512: "tls.PSSWithSHA512",
  rsa_pkcs1_sha512: "tls.PKCS1WithSHA512",
  ecdsa_secp521r1_sha512: "tls.ECDSAWithP521AndSHA512",
  rsa_pkcs1_sha1: "tls.PKCS1WithSHA1",
  ecdsa_sha1: "tls.ECDSAWithSHA1",
};

const renegotiationMapping = {
  0: "tls.RenegotiateNever",
  1: "tls.RenegotiateOnceAsClient",
  2: "tls.RenegotiateFreelyAsClient",
};

const certCompressionMapping = {
  1: "tls.CertCompressionZlib",
  2: "tls.CertCompressionBrotli",
  3: "tls.CertCompressionZstd",
};

const pskModeMapping = {
  0: "tls.PskModePlain",
  1: "tls.PskModeDHE",
};

const curveIDMapping = {
  23: "tls.CurveP256",
  24: "tls.CurveP384",
  25: "tls.CurveP521",
  29: "tls.X25519",
  256: "tls.FAKEFFDHE2048",
  257: "tls.FAKEFFDHE3072",
};

const specialCipherSuites = {
  TLS_DHE_RSA_WITH_CHACHA20_POLY1305_SHA256:
    "tls.FAKE_OLD_TLS_DHE_RSA_WITH_CHACHA20_POLY1305_SHA256",
  TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384:
    "tls.DISABLED_TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384",
  TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384:
    "tls.DISABLED_TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA384",
  TLS_EMPTY_RENEGOTIATION_INFO: "tls.FAKE_TLS_EMPTY_RENEGOTIATION_INFO_SCSV",
  TLS_DHE_RSA_WITH_AES_128_GCM_SHA256:
    "tls.FAKE_TLS_DHE_RSA_WITH_AES_128_GCM_SHA256",
  TLS_RSA_WITH_RC4_128_MD5: "tls.FAKE_TLS_RSA_WITH_RC4_128_MD5",
  TLS_DHE_RSA_WITH_AES_256_CBC_SHA256:
    "tls.FAKE_TLS_DHE_RSA_WITH_AES_256_CBC_SHA256",
  TLS_DHE_RSA_WITH_AES_256_GCM_SHA384:
    "tls.FAKE_TLS_DHE_RSA_WITH_AES_256_GCM_SHA384",
  TLS_DHE_RSA_WITH_AES_256_CBC_SHA256:
    "tls.FAKE_TLS_DHE_RSA_WITH_AES_256_CBC_SHA256",
  TLS_DHE_RSA_WITH_AES_256_CBC_SHA: "tls.FAKE_TLS_DHE_RSA_WITH_AES_256_CBC_SHA",
  TLS_RSA_WITH_AES_256_CBC_SHA256:
    "tls.DISABLED_TLS_RSA_WITH_AES_256_CBC_SHA256",

  TLS_DHE_RSA_WITH_3DES_EDE_CBC_SHA: 0x16,
  TLS_DHE_RSA_WITH_AES_128_CBC_SHA256: 0x67,
  TLS_DHE_RSA_WITH_AES_128_CBC_SHA: 0x33,
  TLS_DHE_RSA_WITH_CAMELLIA_128_CBC_SHA: 0x45,
  TLS_DHE_RSA_WITH_CAMELLIA_128_CBC_SHA256: 0xbe,
  TLS_RSA_WITH_CAMELLIA_128_CBC_SHA256: 0xba,
  TLS_DHE_RSA_WITH_AES_256_GCM_SHA384: 0x9f,
  TLS_GOSTR341001_WITH_28147_CNT_IMIT: 0x81,
  TLS_DHE_RSA_WITH_CAMELLIA_256_CBC_SHA: 0x88,
  TLS_RSA_WITH_CAMELLIA_256_CBC_SHA: 0x84,
  TLS_RSA_WITH_CAMELLIA_128_CBC_SHA: 0x41,
};

const supportedVersionsMapping = {
  "TLS 1.3": "tls.VersionTLS13",
  "TLS 1.2": "tls.VersionTLS12",
  "TLS 1.1": "tls.VersionTLS11",
  "TLS 1.0": "tls.VersionTLS10",
};

const getIntVal = (key) => parseInt(key.split(" (")?.at(-1)?.split(")")?.[0]);

const parseTLSExtension = (ext) => {
  if (typeof ext.name === "string" && ext.name.startsWith("TLS_GREASE")) return `&tls.UtlsGREASEExtension{}`;

  const extensionParsers = {
    "server_name (0)": () => `&tls.SNIExtension{}`,
    "status_request (5)": () => `&tls.StatusRequestExtension{}`,
    "supported_groups (10)": () => `&tls.SupportedCurvesExtension{[]tls.CurveID{${expressionIndent(ext.supported_groups.filter(v => typeof v === "string").map(v => v.startsWith("TLS_GREASE") ? `tls.CurveID(tls.GREASE_PLACEHOLDER)` : (curveIDMapping[getIntVal(v)] || `${getIntVal(v)} /* ${v} */`)), 6)}}}`,
    "ec_point_formats (11)": () => `&tls.SupportedPointsExtension{SupportedPoints: []byte{${ext.elliptic_curves_point_formats.filter(v => typeof v === "string").map(v => v.startsWith("TLS_GREASE") ? `tls.GREASE_PLACEHOLDER` : v).join(", ")}}}`,
    "signature_algorithms (13)": () => `&tls.SignatureAlgorithmsExtension{SupportedSignatureAlgorithms: []tls.SignatureScheme{${expressionIndent(ext.signature_algorithms.filter(v => typeof v === "string").map(v => signatureSchemeMapping[v] || v), 6)}}}`,
    "application_layer_protocol_negotiation (16)": () => `&tls.ALPNExtension{AlpnProtocols: []string{${stringArrayNoatation(ext.protocols)}}}`,
    "signed_certificate_timestamp (18)": () => "&tls.SCTExtension{}",
    "extended_master_secret (23)": () => "&tls.ExtendedMasterSecretExtension{}",
    "compress_certificate (27)": () => `&tls.UtlsCompressCertExtension{[]tls.CertCompressionAlgo{${expressionIndent(ext.algorithms.map(a => `${certCompressionMapping[getIntVal(a)] || getIntVal(a) + ` /* ${a} */`}`), 6)}}}`,
    "session_ticket (35)": () => `&tls.SessionTicketExtension{}`,
    "pre_shared_key (41)": () => "&tls.UtlsPreSharedKeyExtension{OmitEmptyPsk: true}",
    "supported_versions (43)": () => `&tls.SupportedVersionsExtension{[]uint16{${expressionIndent(ext.versions.filter(v => typeof v === "string").map(v => v.startsWith("TLS_GREASE") ? `tls.GREASE_PLACEHOLDER` : supportedVersionsMapping[v]), 6)}}}`,
    "psk_key_exchange_modes (45)": () => `&tls.PSKKeyExchangeModesExtension{[]uint8{${expressionIndent([pskModeMapping[getIntVal(ext.PSK_Key_Exchange_Mode)] || getIntVal(ext.PSK_Key_Exchange_Mode)], 6)}}}`,
    "key_share (51)": () => `&tls.KeyShareExtension{[]tls.KeyShare{${expressionIndent(ext.shared_keys.map(k => {
      const key = Object.keys(k)[0];
      let group = getIntVal(key);
      // i see "Data: []byte{0}" in profile package so i added.
      if (typeof key === "string" && key.startsWith("TLS_GREASE")) group = `tls.CurveID(tls.GREASE_PLACEHOLDER), Data: []byte{0}`;
      if (curveIDMapping[group]) { group = curveIDMapping[group] } else { group = group + ` /* ${key} */` };
      return `{Group: ${group}}`;
    }), 6)}}}`,
    "application_settings (17513)": () => `&tls.ApplicationSettingsExtension{SupportedProtocols: []string{${stringArrayNoatation(ext.protocols)}}}`,
    "extensionEncryptedClientHello (boringssl) (65037)": () => `tls.BoringGREASEECH()`,
    "extensionRenegotiationInfo (boringssl) (65281)": () => `&tls.RenegotiationInfoExtension{Renegotiation: ${renegotiationMapping[parseInt(ext.data)] || parseInt(ext.data)}}`,
  };

  return extensionParsers[ext.name] ? extensionParsers[ext.name]() : `&tls.NotImplemented{/* ${JSON.stringify(ext)} */}`;
};

const parseCipherSuite = (c) => {
  if (c.startsWith("0x")) return c;
  if (c.startsWith("TLS_GREASE")) return "tls.GREASE_PLACEHOLDER";
  if (specialCipherSuites[c]) return specialCipherSuites[c];
  else return "tls." + c;
};

export default (input) => {
  const ciphers = input.tls.ciphers.map((e) => parseCipherSuite(e));
  const h2HeadersFrame =
    input.http2?.sent_frames?.find((f) => f.frame_type === "HEADERS") || {};

  const h2PseudoHeaderOrder =
    h2HeadersFrame.headers
      .filter((h) => h.startsWith(":"))
      ?.map((h) => h.split(": ")[0]) || [];

  const h2HeaderPrio = h2HeadersFrame.priority || {};

  const h2ConnectionFlow =
    input.http2?.sent_frames?.find((f) => f.frame_type === "WINDOW_UPDATE")
      ?.increment || 0;

  const h2Settings =
    input.http2?.sent_frames
      ?.find((f) => f.frame_type === "SETTINGS")
      ?.settings?.map((e) => e.split(" = "))
      ?.map((s) => ({ key: h2SettingsMapping[s[0]], value: parseInt(s[1]) })) ||
    [];

  const extensions = input.tls.extensions.map((e) => parseTLSExtension(e));

  return `
import (
    "github.com/bogdanfinn/tls-client/profiles"
    "github.com/bogdanfinn/fhttp/http2"
    tls "github.com/bogdanfinn/utls"
)

var MyCustomProfile = profiles.NewClientProfile(
	tls.ClientHelloID{
		Client:  "MyCustomProfile",
		Version: "1",
		Seed:    nil,
		SpecFactory: func() (tls.ClientHelloSpec, error) {
			return tls.ClientHelloSpec{
				CipherSuites:       []uint16{${expressionIndent(ciphers, 5)}},
${"\t\t\t\t"}// CompressionMethods is not implemented by tls.peet.ws, check manually
				CompressionMethods: []uint8{${expressionIndent(["tls.CompressionNone"], 5)}},
				Extensions:         []tls.TLSExtension{${expressionIndent(extensions, 5)}},
			}, nil
		},
	},
	map[http2.SettingID]uint32{${expressionIndent(h2Settings.map((e) => `${e.key}: ${e.value}`), 2)}}, 
	[]http2.SettingID{${expressionIndent(h2Settings.map((e) => e.key), 2)}},
	[]string{${stringArrayNoatationIndent(h2PseudoHeaderOrder, 2)}},
	uint32(${h2ConnectionFlow}),
${"\t"}// Priority is not implemented by tls.peet.ws, check manually
	[]http2.Priority{},
${"\t"}&http2.PriorityParam{
${"\t\t"}StreamDep: ${h2HeaderPrio.depends_on || 0},
${"\t\t"}Exclusive: ${h2HeaderPrio.exclusive === 1},
${"\t\t"}Weight: ${h2HeaderPrio.weight - 1 || 0},
${"\t"}},
)
`.trimStart().trimEnd();
};
