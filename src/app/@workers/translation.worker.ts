/// <reference lib="webworker" />

import { pipeline, PipelineType, TextStreamer } from '@huggingface/transformers';

class TranslationPipeline {
    private static _task: PipelineType = 'translation';
    private static _model = 'Xenova/nllb-200-distilled-600M'; // 'google/madlad400-3b-mt'
    private static _instance = null;

    public static async getInstance(progressCallback = null) {
        if (this._instance === null) {
            this._instance = pipeline(
                this._task,
                this._model,
                {
                    progress_callback: progressCallback
                }
            );
        }

        return this._instance;
    }
}

addEventListener('message', async (event) => {
    const translator = await TranslationPipeline.getInstance(message => {
        postMessage(message);
    });

    postMessage({
        status: 'translate-start',
        index: event.data.index
    });

    const streamer = new TextStreamer(translator.tokenizer, {
        skip_prompt: true,
        skip_special_tokens: true,
        callback_function: function(text) {
            postMessage({
                status: 'translate-progress',
                output: text,
                index: event.data.index
            });
        }
    });
    const output = await translator(event.data.text, {
        src_lang: event.data.sourceLanguage,
        tgt_lang: event.data.targetLanguage,
        streamer
    });

    postMessage({
        status: 'translate-done',
        output: output,
        index: event.data.index
    });
});
