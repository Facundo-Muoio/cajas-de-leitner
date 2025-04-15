import FroalaEditorComponent from "react-froala-wysiwyg";
import "froala-editor/js/plugins.pkgd.min.js";

interface EditorProps {
	model?: string | null;
	onModelChange?: (content: string) => void;
	placeholder?: string;
	className?: string;
}

export default function Editor({
	model,
	onModelChange,
	placeholder,
}: EditorProps) {
	const config = {
		placeholderText: placeholder,
		charCounterCount: false,
		heightMin: 150,
		toolbarButtons: {
			moreText: {
				buttons: [
					"bold",
					"italic",
					"underline",
					"strikeThrough",
					"subscript",
					"superscript",
					"fontFamily",
					"fontSize",
					"textColor",
					"backgroundColor",
					"inlineClass",
					"inlineStyle",
					"clearFormatting",
				],

				align: "left",

				buttonsVisible: 3,
			},

			moreParagraph: {
				buttons: [
					"alignLeft",
					"alignCenter",
					"formatOLSimple",
					"alignRight",
					"alignJustify",
					"formatOL",
					"formatUL",
					"paragraphFormat",
					"paragraphStyle",
					"lineHeight",
					"outdent",
					"indent",
					"quote",
				],
				align: "left",
				buttonsVisible: 3,
			},

			moreRich: {
				buttons: [
					"insertLink",
					"insertImage",
					"insertVideo",
					"insertTable",
					"emoticons",
					"fontAwesome",
					"specialCharacters",
					"embedly",
					"insertFile",
					"insertHR",
				],
				align: "left",
				buttonsVisible: 3,
			},

			moreMisc: {
				buttons: [
					"undo",
					"redo",
					"fullscreen",
					"print",
					// "getPDF",
					"spellChecker",
					"selectAll",
					"html",
					"help",
				],
				align: "right",
				buttonsVisible: 2,
			},
		},

		toolbarButtonsXS: [
			["undo", "redo"],
			["bold", "italic", "underline"],
		],
	};

	return (
		<FroalaEditorComponent
			tag="textarea"
			config={config}
			model={model}
			onModelChange={onModelChange}
		/>
	);
}
