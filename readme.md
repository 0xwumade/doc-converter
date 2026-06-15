# Document Converter - PDF ↔ DOCX ↔ PPTX

A powerful tool to convert between PDF, Word documents, and PowerPoint presentations with both CLI and GUI interfaces.

## Features

✓ **6 Conversion Types**
- PDF → DOCX, PDF → PPTX
- DOCX → PDF, DOCX → PPTX  
- PPTX → PDF, PPTX → DOCX

✓ **Batch Processing** - Convert entire directories at once

✓ **Recursive Mode** - Process subdirectories automatically

✓ **Progress Indicators** - Real-time progress bars for long operations

✓ **Better Formatting Preservation** - PDF→DOCX preserves fonts, layouts, and structure

✓ **Comprehensive Testing** - Unit tests for all conversions and error handling

✓ **Dual Interface**
- Command-line interface (CLI) for automation
- Graphical interface (GUI) for ease of use

✓ **Cross-Platform** - Works on Windows, macOS, and Linux

✓ **Configuration Management** - Persistent settings for user preferences and defaults

✓ **Enhanced Error Recovery** - Intelligent fallback methods and error handling for reliability

## Installation

### Prerequisites
- Python 3.7 or higher
- LibreOffice (for PDF conversions via DOCX/PPTX)

### Setup

1. **Clone or download the repository**
```bash
cd CBC_doc_converter
```

2. **Install Python packages**
```bash
pip install pdf2docx python-pptx python-docx pypdf tqdm
```

3. **Install LibreOffice**
   - **Windows**: Download from https://www.libreoffice.org/download/
   - **macOS**: `brew install libreoffice`
   - **Linux**: `sudo apt-get install libreoffice`

## Usage

### GUI (Graphical Interface)

For non-technical users, use the GUI:

```bash
python converter_gui.py
```

**Features:**
- Browse and select files/folders visually
- Toggle batch mode with checkbox
- Enable recursive processing for subdirectories
- Real-time activity log
- Clear error messages

### CLI (Command Line Interface)

For automation and scripting:

#### Single File Conversion

```bash
# Convert PDF to DOCX
python converter.py document.pdf --to docx

# Convert with custom output path
python converter.py slides.pptx --to pdf --output converted.pdf

# Convert DOCX to PPTX
python converter.py report.docx --to pptx
```

#### Batch Conversion

```bash
# Convert all files in a directory to PDF
python converter.py ./documents --to pdf --batch

# Convert with custom output directory
python converter.py ./documents --to docx --batch --output ./converted

# Recursively process all subdirectories
python converter.py ./documents --to pptx --batch --recursive
```

#### Logging

```bash
# Save logs to file
python converter.py document.pdf --to docx --log conversion.log

# Enable verbose/debug logging
python converter.py document.pdf --to docx --verbose

# Both options together
python converter.py ./docs --to pdf --batch --log batch.log --verbose
```

## Examples

### Example 1: Simple PDF to Word conversion
```bash
python converter.py invoice.pdf --to docx
# Output: invoice.docx
```

### Example 2: Batch convert presentations to PDF
```bash
python converter.py ./presentations --to pdf --batch --output ./pdf_versions
# Converts all .pptx and .docx files to PDF
```

### Example 3: With logging for troubleshooting
```bash
python converter.py document.pdf --to pptx --verbose --log debug.log
```

### Example 4: Recursive batch processing
```bash
python converter.py ./company_docs --to docx --batch --recursive --output ./docx_export
# Processes all supported files in company_docs and subdirectories
```

## Supported Conversions

| From | To | Status |
|------|-----|--------|
| PDF | DOCX | ✓ Supported |
| PDF | PPTX | ✓ Supported |
| DOCX | PDF | ✓ Supported |
| DOCX | PPTX | ✓ Supported |
| PPTX | PDF | ✓ Supported |
| PPTX | DOCX | ✓ Supported |

## Formatting Preservation

### PDF to DOCX Conversion

The PDF→DOCX converter now includes enhanced formatting preservation:

- **Text Formatting**: Preserves fonts, sizes, and text styling
- **Layout Structure**: Maintains document structure and spacing
- **Table Detection**: Automatically detects and converts tables
- **Multi-Processing**: Uses multi-core processing for faster conversion
- **Complex Layouts**: Handles images and mixed content

**Important**: 
- Some complex PDF layouts may not convert perfectly
- Always verify important documents after conversion
- Original PDFs with scanned text may have lower quality output

### Other Conversions

- **PDF→PPTX**: Each PDF page becomes a slide with image preservation
- **DOCX→PDF**: Requires LibreOffice; preserves document formatting
- **PPTX→PDF**: Requires LibreOffice; converts presentations to PDF
- **DOCX↔PPTX**: Text-based conversions with basic formatting

## Configuration Management (#8)

The converter now supports persistent configuration files for user preferences and settings.

### Creating a Default Configuration

```bash
# Create a default configuration file
python converter.py --create-config

# This creates ~/.converter_config.json with default settings
```

### Viewing Current Configuration

```bash
# Display the current configuration
python converter.py --show-config

# Output shows all settings from loaded config file or defaults
```

### Configuration File Format

Configuration files are stored as JSON in one of these locations (in order of precedence):
1. `~/.converter_config.json` (user home directory)
2. `./converter_config.json` (current working directory)
3. Script directory `converter_config.json`

### Available Configuration Options

```json
{
  "output_directory": null,
  "default_format": "pdf",
  "batch_mode": false,
  "recursive_mode": false,
  "verbose_logging": false,
  "log_file": null,
  "pdf_quality": "high",
  "enable_multiprocessing": true,
  "timeout_seconds": 300,
  "preserve_formatting": true,
  "fallback_mode": true
}
```

### Using Custom Configuration

```bash
# Use a specific configuration file
python converter.py document.pdf --to docx --config /path/to/config.json

# Settings from the config file will be applied to the conversion
```

### Configuration Options Explained

- **output_directory**: Default output folder for conversions
- **default_format**: Default output format when not specified
- **batch_mode**: Enable batch mode by default
- **recursive_mode**: Enable recursive processing by default
- **verbose_logging**: Enable debug logging by default
- **log_file**: Default log file path
- **pdf_quality**: PDF conversion quality (high/medium/low)
- **enable_multiprocessing**: Use multi-core processing for faster conversions
- **timeout_seconds**: Maximum time for each conversion operation
- **preserve_formatting**: Preserve document formatting when possible
- **fallback_mode**: Use alternative conversion methods if primary fails

## Enhanced Error Recovery and Fallback Methods (#9)

The converter now includes intelligent error recovery with automatic fallback conversion methods for improved reliability.

### How Fallback Works

When a conversion fails, the system automatically attempts alternative methods:

1. **PDF → DOCX Fallback**: If pdf2docx fails, uses pypdf text extraction
   - Falls back from formatting-preserving to text-only extraction
   - Preserves document structure as much as possible
   - Gracefully degrades when complex formatting can't be preserved

2. **Fallback Configuration**: Control fallback behavior via config

```bash
# Disable fallback (strict mode - fails on first error)
echo '{"fallback_mode": false}' > converter_config.json

# Enable fallback (default - attempts alternative methods)
echo '{"fallback_mode": true}' > converter_config.json
```

### Error Handling Features

- **Intelligent Retry Logic**: Attempts multiple conversion methods
- **Graceful Degradation**: Falls back to simpler formats when needed
- **Detailed Logging**: Logs all fallback attempts and reasons
- **User Control**: Configure fallback behavior via settings

### Example: Automatic Fallback

```bash
# If pdf2docx library is missing or fails, automatically uses pypdf
python converter.py problematic.pdf --to docx --verbose

# Output shows:
# [ERROR] Error converting PDF to DOCX: ...
# [WARNING] Primary method failed, attempting fallback...
# [INFO] Using pypdf fallback for PDF→DOCX conversion
# [INFO] Fallback conversion successful: output.docx
```

### Batch Processing with Error Recovery

When processing multiple files, the converter continues on errors:

```bash
# Convert a batch of 100 files - errors don't stop the process
python converter.py ./documents --to pdf --batch --verbose

# Output shows which files succeeded and which had errors
# Failed conversions are logged with detailed error messages
# Batch completes with summary of successful conversions
```

### Logging Error Details

```bash
# Save detailed error information to log file
python converter.py ./docs --to docx --batch --log conversion.log --verbose

# Log file contains:
# - Each conversion attempt (primary and fallback)
# - Specific error messages for each failure
# - Summary of successful vs failed conversions
```

## Testing

### Running Tests

The converter includes comprehensive unit tests covering all functionality:

```bash
# Run all tests with verbose output
python -m pytest test_converter.py -v

# Or use unittest directly
python test_converter.py

# Run specific test class
python -m pytest test_converter.py::TestConverterSetup -v
```

### Test Coverage

The test suite includes 30+ tests covering:

- **Converter Setup Tests** - Logging, dependency checking
- **File Validation Tests** - Invalid inputs, unsupported formats
- **Process Functions** - Single file and batch processing
- **Conversion Signatures** - Return types and error handling
- **Batch Processing** - Recursive mode, output directories
- **Error Handling** - Corrupted files, edge cases
- **Integration Tests** - Complete workflow testing

## Troubleshooting

### LibreOffice Not Found Error
**Problem**: "LibreOffice not found" error when converting DOCX/PPTX to PDF

**Solution**: 
- **Windows**: Install LibreOffice from https://www.libreoffice.org/download/
- **macOS**: `brew install libreoffice`
- **Linux**: `sudo apt-get install libreoffice`

### Missing Dependencies
**Problem**: "Missing required packages" error

**Solution**:
```bash
pip install pdf2docx python-pptx python-docx pypdf tqdm
```

### PDF to PPTX Takes Long Time
**Problem**: Large PDFs take too long to convert to PPTX

**Reason**: Each PDF page is extracted as an image and added to slides
- For 100-page PDFs: typically 30-60 seconds
- Progress bar shows the operation is still running

### Quality Issues in PDF Conversions
**Problem**: Converted PDFs have lower quality

**Note**: 
- PDF → DOCX now preserves formatting with enhanced extraction
- Complex layouts may not preserve perfectly
- Always verify important documents after conversion

## Tips & Best Practices

1. **Use batch mode for large projects**: Process 100s of files automatically

2. **Enable verbose logging**: `--verbose` flag helps debug conversion issues

3. **Check output quality**: Test conversion on a few files first

4. **Use GUI for occasional tasks**: More user-friendly for non-programmers

5. **Use CLI for automation**: Great for scripts and scheduled tasks

6. **Backup originals**: Always keep backups of important documents

7. **Run tests**: Use `python test_converter.py` to verify installation

## Performance Notes

- **PDF → DOCX**: ~2-5 seconds per file (with formatting preservation)
- **PDF → PPTX**: ~1-3 seconds per page
- **DOCX/PPTX → PDF**: ~1-2 seconds per file
- **Batch processing**: Linear - 10 files takes ~10x longer than 1 file

## System Requirements

- **RAM**: 2GB minimum, 4GB+ recommended
- **Disk**: At least 500MB free space
- **CPU**: Modern processor (any from last 5 years)

## Limitations

- Complex PDF layouts may not convert perfectly to DOCX
- PDF → PPTX creates one slide per PDF page (use for simple scanned documents)
- Macros in Word documents are not preserved in PDF conversion
- Embedded media in presentations may not transfer to Word documents

## License

This project is provided as-is for document conversion tasks.

## Support

For issues or feature requests, check the activity logs for detailed error messages.

---

**Created**: 2026
**Latest Update**: June 15, 2026
