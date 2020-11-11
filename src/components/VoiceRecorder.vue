<template>
	<v-col class="px-0">
		<v-card>
			<v-row v-if="!this.recordedAudio" class="ma-0 pa-0">
				<v-col class="flex-grow-0 mr-n6">
					<v-btn 
						icon
						x-large
						:disabled="!mediaSupported || recordedAudio!=null"
						v-if="!isRecording"
						color="green"
						@click="recordAudio()"
					>
						<v-icon>mdi-microphone</v-icon>
					</v-btn>
					<v-btn 
						icon
						x-large
						:disabled="!mediaSupported"
						v-else
						color="error"
						@click="stopRecording()"
					>
						<v-icon>mdi-stop</v-icon>
					</v-btn>
				</v-col>
				<v-col class="flex-grow-1 pr-6">
					<canvas class="visualizer" style="width: 100%; height: 50px;"></canvas>
				</v-col>
			</v-row>
			<v-row v-if="this.isRecording" class="mx-0 px-0">
				<v-col class="pl-8 flex-grow-0">{{ `${recordingDuration}s` }}</v-col>
				<v-col class="flex-grow-1 d-flex align-center">
					<v-progress-linear :color="progressColor" :value="percentageRecorded"/>
				</v-col>
				<v-col 
					cols="2" 
					class="flex-grow-0" 
					style="word-break: none;"
				>
					{{ `${maxRecordingDuration}s max` }}
				</v-col>
			</v-row>
			<v-row v-if="this.recordedAudio" class="mx-0 px-0 mb-n8">
				<v-col class="flex-grow-1 pl-4 pr-0">
					<audio controls :src="recordedURL" style="width: 100%;" />
				</v-col>
				<v-col class="flex-grow-0">
					<v-btn icon x-large @click="downloadAudio()">
						<v-icon>mdi-download</v-icon>
					</v-btn>
				</v-col>
				<v-col class="flex-grow-0 pl-0 ml-n2">
					<WarningDialog 
						:icon="'mdi-delete'"
						:size="'x-large'"
						:title="'Delete Audio Recording?'"
						:warning="'Are you sure you want to delete the audio you\'ve recorded?'"
						:acceptLabel="'Delete File'"
						@acceptclicked="deleteAudio()"
					/>
				</v-col>
				<v-col cols="12" class="mt-n10 mb-n4 text-center">
					<v-card-text style="font-size: small;"><em>If you'd like to record an alternate take, delete this one first.</em></v-card-text>
				</v-col>
			</v-row>
		</v-card>
	</v-col>
</template>

		"buttonLabel",
		"buttonColor",
		"title",
		"warning",
		"acceptLabel"
<script>
export default {
	props: [
		"voiceline"
	],
	components: {
		WarningDialog: () => import("@/components/WarningDialog.vue")
	},
	data: () => ({
		recorder: null,
		isRecording: false,
		audioChunks: [],
		recordedAudio: null,
		recordedURL: null,
		audioStream: null,
		audioContext: null,
		recordingStarted: null,
		now: null,
		maxRecordingDuration: 90,
		dangerDurationPercent: 10,
		maxFilenameWords: 3,
		delayUntilBasicDraw: .1,
		visualizer: {
			dataArray: null,
			analyser: null,
			bufferLength: null,
			linewidth: 3,
			backgroundColor: "white",
			lineColor: "black"
		}
	}),
	methods: {
		recordAudio() {
			navigator.mediaDevices.getUserMedia(
				{audio: true}
			).then((stream) => {
				this.audioStream = stream;
				this.recorder = new MediaRecorder(stream);
				this.recorder.ondataavailable = (e) => {
					this.audioChunks.push(e.data) };
				this.recorder.onstop = () => {
					let blob = new Blob(this.audioChunks, { "type": "audio/mp3; codecs=opus" });
					// let blob = new Blob(this.audioChunks, { "type": "audio/mp3" });
					this.audioChunks = [];
					this.recordedURL = window.URL.createObjectURL(blob);
					this.recordedAudio = blob;
					this.recorder = null;
					this.$emit("audiorecorded", this.recordedURL);
				}
				this.startRecording();
			}).catch((err) => {
				console.log('The following getUserMedia error occured: ' + err);
			});
		},
		startRecording() {
			this.recorder.start();
			this.visualize();
			this.isRecording = true;
			this.recordingStarted = new Date().getTime();
			this.scheduledUpdate();
		},
		scheduledUpdate() {
			this.now = new Date().getTime();
			setTimeout(() => { this.scheduledUpdate()}, 1000);
		},
		stopRecording() {
			this.recorder.stop();
			this.isRecording = false;
		},
		visualize() {
			if(!this.audioContext) {
				this.audioContext = new AudioContext();
			}

			const source = this.audioContext.createMediaStreamSource(this.audioStream);

			this.visualizer.analyser = this.audioContext.createAnalyser();
			this.visualizer.analyser.fftSize = 2048;
			this.visualizer.bufferLength = this.visualizer.analyser.frequencyBinCount;
			this.visualizer.dataArray = new Uint8Array(this.visualizer.bufferLength);

			source.connect(this.visualizer.analyser);

			this.draw()
		},
		draw() {
			let canvas = document.querySelector('.visualizer');
			if (!canvas) return;
			let canvasCtx = canvas.getContext("2d");
			const WIDTH = canvas.width
			const HEIGHT = canvas.height;

			requestAnimationFrame(this.draw);
			if (!this.isRecording) return;

			this.visualizer.analyser.getByteTimeDomainData(this.visualizer.dataArray);

			canvasCtx.fillStyle = this.visualizer.backgroundColor;
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

			canvasCtx.lineWidth = 3;
			canvasCtx.strokeStyle = this.visualizer.lineColor;

			canvasCtx.beginPath();

			let sliceWidth = WIDTH * 1.0 / this.visualizer.bufferLength;
			let x = 0;

			for(let i = 0; i < this.visualizer.bufferLength; i++) {

				let v = this.visualizer.dataArray[i] / 128.0;
				let y = v * HEIGHT/2;

				if(i === 0) {
					canvasCtx.moveTo(x, y);
				} else {
					canvasCtx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			canvasCtx.lineTo(WIDTH, HEIGHT/2);
			canvasCtx.stroke();
		},
		basicDraw() {
			let canvas = document.querySelector('.visualizer');
			let canvasCtx = canvas.getContext("2d");
			const WIDTH = canvas.width
			const HEIGHT = canvas.height;

			canvasCtx.fillStyle = this.visualizer.backgroundColor;
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

			canvasCtx.lineWidth = 3;
			canvasCtx.strokeStyle = this.visualizer.lineColor;

			canvasCtx.beginPath();
			canvasCtx.moveTo(0, HEIGHT/2)
			canvasCtx.lineTo(WIDTH, HEIGHT/2);
			canvasCtx.stroke();
		},
		deleteAudio() {
			this.recordedAudio=null; 
			this.recordedURL=null;
			setTimeout(() => {
				this.basicDraw();
			}, this.delayUntilBasicDraw * 1000);
			this.$emit("audiodeleted");
		},
		downloadAudio() {
			let link = document.createElement("a");
			link.href = this.recordedURL;
			link.download = this.filename;
			link.click();
		}
	},
	computed: {
		mediaSupported() {
			return navigator.mediaDevices && navigator.mediaDevices.getUserMedia
		},
		percentageRecorded() {
			return (this.recordingDuration / this.maxRecordingDuration) * 100;
		},
		recordingDuration() {
			let duration = Math.round((this.now - this.recordingStarted) / 1000);
			if (duration > this.maxRecordingDuration) this.stopRecording();
			return duration; 
		},
		progressColor() {
			let remainingDuration = this.maxRecordingDuration - this.recordingDuration;
			let dangerZone = this.maxRecordingDuration * this.dangerDurationPercent / 100;
			if (remainingDuration <= dangerZone) return "error";
			return "primary";
		},
		filename() {
			let strippedLine = this.voiceline.replace(/[^\s\w]/g, "");
			console.log(strippedLine);
			let splitLine = strippedLine.split(" ");
			if (splitLine.length > this.maxFilenameWords) {
				splitLine = splitLine.slice(0, this.maxFilenameWords);
			}
			let filename = splitLine.join(" ");
			filename += ` (${new Date().getMonth()}-${new Date().getDate()})`;
			return `${filename}.mp3`;
		}
	},
	mounted() {
		this.basicDraw();
	}
}
</script>

<style>

</style>