const arrayify = (arr) => arr.map((e) => `"${e}"`).join(", ");

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

const parseTlsExtension = (ext) => {
  if (ext.name?.startsWith("TLS_GREASE")) return `&tls.UtlsGREASEExtension{}`;
  switch (ext.name) {
    case "server_name (0)":
      return `&tls.SNIExtension{}`;

    case "status_request (5)":
      return `&tls.StatusRequestExtension{}`;

    case "supported_groups (10)":
      return `&tls.SupportedCurvesExtension{Curves: []tls.CurveID{${ext.supported_groups
        .map((v) => {
          if (v.startsWith("TLS_GREASE"))
            return `tls.CurveID(tls.GREASE_PLACEHOLDER)`;
          else return getIntVal(v) + `/* ${v} */`;
        })
        .join(", ")}}}`;

    case "ec_point_formats (11)":
      return `&tls.SupportedPointsExtension{SupportedPoints: []uint8{${ext.elliptic_curves_point_formats
        .map((v) => {
          if (v.startsWith("TLS_GREASE")) return `tls.GREASE_PLACEHOLDER`;
          else return v;
        })
        .join(", ")}}}`;

    case "signature_algorithms (13)":
      return `&tls.SignatureAlgorithmsExtension{SupportedSignatureAlgorithms: []tls.SignatureScheme{${ext.signature_algorithms
        .map(
          (v) => signatureSchemeMapping[v] || `tls.NotImplemented /* ${v} */`
        )
        .join(", ")}}}`;

    case "application_layer_protocol_negotiation (16)":
      return `&tls.ALPNExtension{AlpnProtocols: []string{${arrayify(
        ext.protocols
      )}}}`;

    case "signed_certificate_timestamp (18)":
      return "&tls.SCTExtension{}";

    case "extended_master_secret (23)":
      return "&tls.ExtendedMasterSecretExtension{}";

    case "compress_certificate (27)":
      return `&tls.UtlsCompressCertExtension{Algorithms: []tls.CertCompressionAlgo{${ext.algorithms
        .map((a) => {
          const val = getIntVal(a);
          return `${val} /* ${a} */`;
        })
        .join(", ")}}}`;

    case "session_ticket (35)":
      return `&tls.SessionTicketExtension{}`;

    case "pre_shared_key (41)":
      return "&tls.UtlsPreSharedKeyExtension{OmitEmptyPsk: true}";

    case "supported_versions (43)":
      return `&tls.SupportedVersionsExtension{Versions: []uint16{${ext.versions
        .map((v) => {
          if (v.startsWith("TLS_GREASE")) return `tls.GREASE_PLACEHOLDER`;
          else return supportedVersionsMapping[v];
        })
        .join(", ")}}}`;

    case "psk_key_exchange_modes (45)":
      return `&tls.PSKKeyExchangeModesExtension{Modes: []uint8{${getIntVal(
        ext.PSK_Key_Exchange_Mode
      )} /* ${ext.PSK_Key_Exchange_Mode} */}}`;

    case "key_share (51)":
      return `&tls.KeyShareExtension{KeyShares: []tls.KeyShare{${ext.shared_keys
        .map((k) => {
          let key = Object.keys(k)[0];
          let group = getIntVal(key);
          if (key?.startsWith("TLS_GREASE"))
            group = `tls.CurveID(tls.GREASE_PLACEHOLDER)`;
          return `{Group: ${group} /* ${key} */}`;
        })
        .join(", ")}}}`;

    case "application_settings (17513)":
      return `&tls.ApplicationSettingsExtension{SupportedProtocols: []string{${arrayify(
        ext.protocols
      )}}}`;

    case "extensionEncryptedClientHello (boringssl) (65037)":
      return `tls.BoringGREASEECH()`;

    case "extensionRenegotiationInfo (boringssl) (65281)":
      return `&tls.RenegotiationInfoExtension{Renegotiation: ${parseInt(
        ext.data
      )}}`;

    default:
      return `&tls.NotImplemented{/* ${JSON.stringify(ext)} */}`;
  }
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

  const extensions = input.tls.extensions.map((e) => parseTlsExtension(e));

  return `import (
    "github.com/bogdanfinn/tls-client/profiles"
    "github.com/bogdanfinn/fhttp/http2"
    tls "github.com/bogdanfinn/utls"
)

var MyCustomClient = profiles.NewClientProfile(
	tls.ClientHelloID{
		Client:  "MyCustomClient",
		Version: "1",
		Seed:    nil,
		SpecFactory: func() (tls.ClientHelloSpec, error) {
			return tls.ClientHelloSpec{
				CipherSuites:       []uint16{${ciphers.join(", \n")}},
				CompressionMethods: []uint8{tls.CompressionNone}, // Not implemented in tools.peet.ws - check manually
				Extensions:         []tls.TLSExtension{${extensions.join(", \n")}},
			}, nil
		},
	},
	map[http2.SettingID]uint32{${h2Settings
    .map((e) => `${e.key}: ${e.value}`)
    .join(", ")}}, 
	[]http2.SettingID{${h2Settings.map((e) => e.key).join(", ")}},
	[]string{${arrayify(h2PseudoHeaderOrder)}},
	uint32(${h2ConnectionFlow}),
	[]http2.Priority{}, // Not implemented in tools.peet.ws - check manually
	&http2.PriorityParam{Weight: ${h2HeaderPrio.weight - 1 || 0}, Exclusive: ${
    h2HeaderPrio.exclusive === 1
  }, StreamDep: ${h2HeaderPrio.depends_on || 0}},
)`;
};
