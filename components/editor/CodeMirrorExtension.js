// import CodeMirror from '@uiw/react-codemirror';
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { StreamLanguage } from "@codemirror/language";
import { clike } from "@codemirror/legacy-modes/mode/clike";
import { useEffect, useState, useRef } from "react";
import { useTheme, Button, Spacer, Dropdown, Card, Collapse } from "@nextui-org/react";
import { NodeViewWrapper } from "@tiptap/react";
import { TIO, LANGUAGES as TioLanguages } from "@/node/tio";

import { oneDark } from "@codemirror/theme-one-dark";
import { tomorrow } from "thememirror";

const themeExtensions = {
	light: [tomorrow],
	dark: [oneDark],
};

export const Extension = ({
	node: {
		attrs: { language: lang, code_content: doc, code_output: result, system_output: time },
	},
	updateAttributes,
	extension,
}) => {
	const refEditor = useRef(null);
	const [language, setLanguage] = useState();
	const [input, setInput] = useState([]);
	const [systemInfo, setSystemInfo] = useState(time == "" ? true : false);
	const { checked, type } = useTheme();

	const langDict = {
		"c-clang": "C",
		"cpp-clang": "C++",
		"java-jdk": "Java",
		"javascript-node": "JavaScript",
		"python3": "Python",
	};

	const run = async (event) => {
		const compiled = await TIO.run(doc, input, lang);
		const output = compiled.slice(0, (compiled.length - 6)).join("\n")
		const system = compiled.slice(compiled.length-6).join("\n")
		updateAttributes({ code_output: output, system_output: system});
		setSystemInfo(false)
		console.log(compiled);
	};

	useEffect(() => {
		let isDark = type === "dark" ? true : false;
		const view = new EditorView({
			doc,
			extensions: [
				basicSetup,
				keymap.of([indentWithTab]),
				javascript(),
				EditorView.updateListener.of((v) => {
					if (v.docChanged) {
						updateAttributes({ code_content: v.state.doc.toString() });
					}
				}),
				EditorView.theme({}, { dark: isDark }),
				...themeExtensions[isDark ? "dark" : "light"],
			],
			parent: refEditor.current,
		});
		return () => {
			view.destroy();
		};
	}, [type]);

	return (
		<NodeViewWrapper>
			<Card
				variant="bordered"
				css={{ $$cardColor: "rgba(255,255,255,0.0)", resize: "both" }}
			>
				<Card.Body>
					<div className="maindiv" contentEditable={false}>
						<Dropdown>
							<Dropdown.Button light css={{ tt: "capitalize" }}>
								{langDict[lang]}
							</Dropdown.Button>
							<Dropdown.Menu
								items={TioLanguages}
								onAction={(key) => {
									updateAttributes({ language: TioLanguages[key] });
								}}>
								{TioLanguages.map((lang, index) => (
									<Dropdown.Item key={index} value={lang}>
										{langDict[lang]}
									</Dropdown.Item>
								))}
							</Dropdown.Menu>
						</Dropdown>

						<div ref={refEditor} />
						<Spacer y={0.5} />
						<Button
							bordered
							auto
							ghost
							size="xs"
							onClick={() => run()}>
							Run Code
						</Button>

						<Spacer y={0.5} />
						<hr></hr>
						<Spacer y={0.5} />
						<div className="output">
							<Collapse.Group accordion={false}>
							<Collapse disabled={systemInfo} title="Output:">
								<span> {result} </span>
							</Collapse>
							<Collapse disabled={systemInfo} title="System Info:">
								{time}
							</Collapse>
							</Collapse.Group>
						</div>
					</div>
				</Card.Body>
			</Card>
		</NodeViewWrapper>
	);
};
