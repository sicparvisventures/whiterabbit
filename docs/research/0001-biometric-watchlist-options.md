# Research 0001: Biometric Watchlist Options

- Status: evidence for specification; not a dependency decision
- Date: 2026-08-13
- Scope: public sources and open-source repositories only

## Product Pattern

NEC publicly describes NeoFace Watch as a pipeline that captures faces from live or
recorded video, performs a quality check, creates a facial template, compares it to
a selected watchlist, raises threshold-based candidate alerts, sends those alerts
to human review, and retains alert images only for a configured period. WhiteRabbit
can implement that public product pattern without copying proprietary code, models,
assets, claims, or interfaces.

WhiteRabbit must keep ALPR and object detection. Biometric identification is an
additional capability on the same edge event pipeline, not a replacement.

## Open-Source Findings

| Candidate | Licence and activity | Fit | Decision for first benchmark |
| --- | --- | --- | --- |
| ONNX Runtime Web | MIT; actively maintained | TypeScript/browser inference with WASM, WebGL, and platform-dependent accelerators | Use as runtime candidate |
| OpenCV YuNet | Model directory is MIT | Compact face detection and five landmarks in ONNX | Benchmark with synthetic data |
| OpenCV SFace | Model directory is Apache-2.0 | Compact ONNX face embedding and comparison | Benchmark with synthetic data |
| MediaPipe | Apache-2.0; actively maintained | Strong cross-platform face detection/tracking primitives; not by itself a watchlist recognizer | Evaluate detector alternative |
| InsightFace | Code is MIT; common pretrained models are non-commercial research only and require separate production licensing | Strong recognition ecosystem and optional licensed mobile SDK | Do not ship unlicensed weights; commercial evaluation only after approval |
| CompreFace | Apache-2.0 server code; last published release observed from 2023 | Useful REST, enrollment, role, and self-hosting reference; server-oriented rather than iPhone edge | Architecture reference, not initial dependency |
| Human | MIT JavaScript project; browser recognition support | Useful browser prototype comparator | Evaluate model provenance and performance before any adoption |
| face-api.js | MIT; latest release observed from 2020 | Demonstrates browser recognition but has a stale release cadence | Do not use as default |
| DeepFace | MIT Python wrapper; current development | Useful evaluation harness across model families; individual models carry their own terms | Lab-only evaluation candidate |

Repository licences do not automatically grant rights to training datasets,
downloaded weights, trademarks, or biometric reference images. Every model artifact
needs an immutable digest, source, licence record, training-data statement, intended
use, and approval before it enters a build.

## iPhone and Browser Findings

The application shell, operator UI, policies, and edge orchestration can be written
in Next.js, React, and TypeScript. Browser capture uses `getUserMedia`; inference can
run in a Worker through ONNX Runtime Web.

Current ONNX Runtime documentation lists WASM and WebGL for Safari/iOS but not
WebGPU or WebNN. WebGL is in maintenance mode. WebKit also has documented iPhone PWA
camera failures and regressions across releases and devices. Consequently:

- a pure web node is a foreground, attended or kiosk-style node;
- it must survive camera-track loss and visibly report degraded/offline state;
- detection runs at a controlled cadence and tracking avoids repeat embedding work;
- input resolution and thermal limits are benchmarked on each supported device tier;
- reliable background or locked-screen sentry operation is not promised;
- a native container/inference adapter using the same TypeScript contracts remains
  an allowed fallback if the browser cannot meet an approved operating point.

No architecture document may claim real-time iPhone performance until a reproducible
device benchmark measures latency, sustained throughput, memory, battery, thermals,
camera recovery, and false alert rates.

## Belgian and EU Boundary Findings

- The Belgian DPA treats facial templates used to identify a person as sensitive
  biometric data and points to a DPIA because of the high risk.
- The EU AI Act defines remote biometric identification as identifying a person
  without active involvement by comparing biometric data to a reference database.
- Untargeted scraping of internet or CCTV facial images to create or expand a facial
  recognition database is a prohibited practice. OSINT availability is therefore
  not watchlist authority.
- Real-time remote biometric identification in publicly accessible spaces for law
  enforcement is prohibited in principle, with narrowly enumerated exceptions,
  strict necessity/proportionality, targeted scope, and prior judicial or binding
  independent-administrative authorization under national rules.
- Belgian parliamentary material records that detailed national rules are required
  for police to use those exceptions and that such legislation was being prepared.
- Belgian police currently performs specialist facial comparison through BIS-FACIAL;
  that is not evidence of authorization for arbitrary live watchlist deployments.
- An AI system used exclusively for military, defence, or national-security purposes
  is outside the AI Act's scope. A system also placed on the market or used for
  civilian or law-enforcement purposes falls within scope for those uses. WhiteRabbit
  therefore cannot apply a blanket Defence exemption to its multi-controller SaaS.
- For ordinary non-police surveillance, Belgian camera guidance states that smart
  cameras linked to personal-data files for facial recognition are not permitted,
  while ANPR is treated as an exception. Municipal biometric watchlists are disabled
  absent a new, specific authority and reviewed specification.

## References

- NEC NeoFace Watch: https://www.nec.com/en/global/solutions/biometrics/face/neofacewatch.html
- NEC workflow brochure: https://uk.nec.com/en_GB/en/global/solutions/safety/pdf/NEC-NeoFace_Watch.pdf
- ONNX Runtime Web support: https://onnxruntime.ai/docs/get-started/with-javascript/web.html
- ONNX Runtime: https://github.com/microsoft/onnxruntime
- MediaPipe: https://github.com/google-ai-edge/mediapipe
- OpenCV Zoo: https://github.com/opencv/opencv_zoo
- InsightFace and model terms: https://github.com/deepinsight/insightface
- CompreFace: https://github.com/exadel-inc/CompreFace
- Human: https://github.com/vladmandic/human
- face-api.js: https://github.com/justadudewhohacks/face-api.js
- DeepFace: https://github.com/serengil/deepface
- WebKit PWA camera issue: https://bugs.webkit.org/show_bug.cgi?id=282327
- Belgian DPA facial-recognition guidance: https://gegevensbeschermingsautoriteit.be/burger/thema-s/recht-op-afbeelding/gezichtsherkenning-en-recht-op-afbeelding
- EU AI Act: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- Belgian Parliament, biometric identification and AI: https://www.dekamer.be/doc/CCRI/html/56/ic115x.html
- Belgian Federal Police BIS-FACIAL: https://www.police.be/5998/en/node/20010
- Belgian non-police camera guidance: https://www.police.be/5285/questions/cameras-de-surveillance/cameras-de-surveillance-nouvelle-reglementation

This research is engineering input, not legal advice or deployment authorization.
