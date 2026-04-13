import React, { useState, useEffect, useCallback } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import {text }from '../../src/utils/mark-down-html'
import  {FileText,Undo2}  from 'lucide-react';
import { Badge } from './ui/badge';


const MarkdownEditorComponent = () => {
  const [markdown, setMarkdown] = useState(text);

  const [preview, setPreview] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const html = marked(markdown) as string;
    const sanitized = DOMPurify.sanitize(html);
    setPreview(sanitized);
    setWordCount(markdown.split(/\s+/).filter(Boolean).length);

    setHistory((prev) => [...prev.slice(-50), markdown]);
  }, [markdown]);


  const handleUndo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length > 1) {
        const newHistory = prev.slice(0, -1);
        setMarkdown(newHistory[newHistory.length - 1]);
        return newHistory;
      }
      return prev;
    });
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMarkdown(e.target.value);
    },
    []
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Markdown Editor
          </CardTitle>

          <div className="flex items-center gap-3">
            <Badge variant="outline">Words: {wordCount}</Badge>
            <Badge variant="secondary">History: {history.length}</Badge>
            <Badge variant="outline">Chars: {markdown.length}</Badge>

            <Button
              aria-label='Undo'
              variant="ghost"
              size="sm"
              className="h-7"
              onClick={handleUndo}
            >
              <Undo2 className="h-3 w-3 mr-1" />
              Undo
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Editor</h4>
            <textarea
              value={markdown}
              onChange={handleChange}
              className="w-full h-75 p-3 font-mono text-sm border rounded-md resize-y bg-background"
              aria-label='markdown-editor-textarea'
            />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Preview</h4>

            <div
              className="h-75 overflow-auto p-3 border rounded-md bg-muted/30 prose prose-sm max-w-none"
              aria-live='polite'
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MarkdownEditor = React.memo(MarkdownEditorComponent);

export default MarkdownEditor;