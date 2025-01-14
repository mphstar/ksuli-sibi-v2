"use client";
import LayoutPage from "@/components/templates/LayoutPage";
import { useEffect, useRef, useState } from "react";
import { FaCircleCheck } from "react-icons/fa6";
import * as tf from "@tensorflow/tfjs";
import { FilesetResolver, HandLandmarker } from "@mediapipe/tasks-vision";
import calcLandmarkList from "@/utils/CalculateLandmark";
import preProcessLandmark from "@/utils/PreProcessLandmark";
import ConvertResult from "@/utils/ConvertResult";
import useNavbarStore from "@/stores/NavbarStore";

tf.env().set("DEBUG", false); // Nonaktifkan debug

type PredictResult = {
  abjad: String;
  acc: String;
};

const page = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loadCamera, setLoadCamera] = useState(false);

  const [resultPredict, setResultPredict] = useState<PredictResult>({
    abjad: "",
    acc: "",
  });

  let model: tf.LayersModel;
  let handLandmarker: HandLandmarker;

  const [handPresence, setHandPresence] = useState(false);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      //   setLoadCamera(true);
      await initializeHandDetection();
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  const loadModel = async () => {
    setLoadCamera(false);
    try {
      const lm = await tf.loadLayersModel("/model/model.json");
      model = lm;

      const emptyInput = tf.tensor2d([[0, 0]]);

      model.predict(emptyInput) as tf.Tensor;

      setLoadCamera(true);
    } catch (error) {
      //   console.error("Error loading model:", error);
    }
  };

  const initializeHandDetection = async () => {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      );
      handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
        },
        numHands: 2,
        runningMode: "VIDEO",
      });

      detectHands();
    } catch (error) {
      console.error("Error initializing hand detection:", error);
    }
  };

  const makePrediction = async (finalResult: any) => {
    const input = tf.tensor2d([finalResult]);

    // Melakukan prediksi
    const prediction = model.predict(input) as tf.Tensor;

    const result = prediction.dataSync();

    const maxEntry = Object.entries(result).reduce((max, entry) => {
      const [, value] = entry;
      return value > max[1] ? entry : max;
    });

    // maxEntry sekarang berisi [key, value] dengan nilai terbesar
    const [maxKey, maxValue] = maxEntry;

    const percentageValue = (maxValue * 100).toFixed(2) + "%";

    setResultPredict({
      abjad: ConvertResult(parseInt(maxKey)),
      acc: percentageValue,
    });

    // Hapus tensor
    input.dispose();
    prediction.dispose();
  };

  const drawHandShape = (
    canvas: HTMLCanvasElement,
    landmarks: { x: number; y: number }[]
  ) => {
    if (!canvas || !landmarks || landmarks.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Bersihkan canvas sebelumnya
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set gaya garis
    ctx.strokeStyle = "#00FF00"; // Warna hijau
    ctx.lineWidth = 2;

    // Mulai menggambar garis antar titik landmark
    ctx.beginPath();
    for (let i = 0; i < landmarks.length; i++) {
      const { x, y } = landmarks[i];
      if (i === 0) {
        // Pindahkan ke titik awal
        ctx.moveTo(x * canvas.width, y * canvas.height);
      } else {
        // Gambar garis ke titik berikutnya
        ctx.lineTo(x * canvas.width, y * canvas.height);
      }
    }

    // Tutup path (opsional)
    ctx.closePath();

    // Gambar stroke
    ctx.stroke();

    // Gambar titik landmark
    landmarks.forEach(({ x, y }) => {
      ctx.beginPath();
      ctx.arc(x * canvas.width, y * canvas.height, 2, 0, 2 * Math.PI); // Titik dengan radius 5
      ctx.fillStyle = "#FF0000"; // Warna merah
      ctx.fill();
    });
  };

  const clearCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Bersihkan canvas sebelumnya
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const detectHands = async () => {
    if (videoRef.current && videoRef.current.readyState >= 2) {
      const detections = handLandmarker.detectForVideo(
        videoRef.current,
        performance.now()
      );

      setHandPresence(detections.handedness.length > 0);

      // Assuming detections.landmarks is an array of landmark objects
      if (detections.landmarks) {
        if (detections.handednesses.length > 0) {
          const landm = detections.landmarks[0].map((landmark) => landmark);

          const calt = calcLandmarkList(videoRef.current, landm);
          const finalResult = preProcessLandmark(calt);

          makePrediction(finalResult);

          if (canvas.current) {
            drawHandShape(canvas.current, landm);
          }
        } else {
          if (canvas.current) {
            clearCanvas(canvas.current);
          }
        }
      }
    }
    requestAnimationFrame(detectHands);
  };

  const store = useNavbarStore();

  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {

    loadModel();
    startWebcam();

    setLoadCamera(true);

    return () => {
      // stop camera
    };
  }, []);

  return (
    <LayoutPage>
      <div className="flex flex-col flex-1 py-4">
        {loadCamera ? (
          <div className="rounded-md overflow-hidden relative">
            {handPresence && (
              <div className="top-6 left-6 absolute flex gap-2 items-center bg-white text-black rounded-md drop-shadow px-3 py-2">
                <FaCircleCheck className="text-green-500" />
                <h1 className="text-2xl font-semibold text-center">
                  {resultPredict.abjad} ({resultPredict.acc})
                </h1>
              </div>
            )}
            <canvas
              ref={canvas}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            ></canvas>
            <video
              ref={videoRef}
              className="w-full max-h-[80svh] object-cover"
              autoPlay
              playsInline
            ></video>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </LayoutPage>
  );
};

export default page;
