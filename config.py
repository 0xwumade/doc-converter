#!/usr/bin/env python3
"""
Configuration management for the Document Converter.
Supports JSON configuration files with user preferences and settings.
"""

import json
import os
from pathlib import Path
import logging

logger = logging.getLogger('converter')


DEFAULT_CONFIG = {
    "output_directory": None,
    "default_format": "pdf",
    "batch_mode": False,
    "recursive_mode": False,
    "verbose_logging": False,
    "log_file": None,
    "pdf_quality": "high",  # high, medium, low
    "enable_multiprocessing": True,
    "timeout_seconds": 300,
    "preserve_formatting": True,
    "fallback_mode": True,
}

# Config file locations to check (in order of precedence)
CONFIG_LOCATIONS = [
    Path.home() / ".converter_config.json",  # User home directory
    Path(".") / "converter_config.json",      # Current directory
    Path(__file__).parent / "converter_config.json",  # Script directory
]


class ConverterConfig:
    """Configuration manager for the converter."""
    
    def __init__(self, config_file=None):
        """Initialize configuration from file or defaults."""
        self.config_file = config_file
        self.config = DEFAULT_CONFIG.copy()
        
        # Try to load config from specified file or default locations
        if config_file:
            self.load(config_file)
        else:
            self.load_from_default_locations()
    
    def load_from_default_locations(self):
        """Load config from standard locations."""
        for config_path in CONFIG_LOCATIONS:
            if config_path.exists():
                self.load(str(config_path))
                logger.info(f"Loaded config from: {config_path}")
                return
        
        logger.debug("No config file found, using defaults")
    
    def load(self, config_file):
        """Load configuration from JSON file."""
        try:
            with open(config_file, 'r') as f:
                user_config = json.load(f)
            
            # Merge with defaults (user config overrides defaults)
            self.config.update(user_config)
            self.config_file = config_file
            
            logger.info(f"Loaded configuration from: {config_file}")
            logger.debug(f"Config values: {self.config}")
            
            return True
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in config file: {e}")
            return False
        except Exception as e:
            logger.warning(f"Could not load config from {config_file}: {e}")
            return False
    
    def save(self, config_file=None):
        """Save configuration to JSON file."""
        save_path = config_file or self.config_file or CONFIG_LOCATIONS[0]
        
        try:
            # Create directory if needed
            Path(save_path).parent.mkdir(parents=True, exist_ok=True)
            
            with open(save_path, 'w') as f:
                json.dump(self.config, f, indent=2)
            
            self.config_file = save_path
            logger.info(f"Saved configuration to: {save_path}")
            return True
        except Exception as e:
            logger.error(f"Could not save config to {save_path}: {e}")
            return False
    
    def get(self, key, default=None):
        """Get configuration value."""
        return self.config.get(key, default)
    
    def set(self, key, value):
        """Set configuration value."""
        self.config[key] = value
        logger.debug(f"Config updated: {key} = {value}")
    
    def reset_to_defaults(self):
        """Reset all configuration to defaults."""
        self.config = DEFAULT_CONFIG.copy()
        logger.info("Configuration reset to defaults")
    
    def get_all(self):
        """Get all configuration values."""
        return self.config.copy()
    
    def update_from_dict(self, config_dict):
        """Update config from dictionary."""
        for key, value in config_dict.items():
            if key in DEFAULT_CONFIG:
                self.set(key, value)
            else:
                logger.warning(f"Unknown config key ignored: {key}")
    
    def validate(self):
        """Validate configuration values."""
        errors = []
        
        # Validate PDF quality
        if self.config.get('pdf_quality') not in ['high', 'medium', 'low']:
            errors.append("pdf_quality must be 'high', 'medium', or 'low'")
        
        # Validate timeout
        if not isinstance(self.config.get('timeout_seconds'), (int, float)):
            errors.append("timeout_seconds must be a number")
        
        # Validate output directory if specified
        output_dir = self.config.get('output_directory')
        if output_dir and not os.path.exists(output_dir):
            logger.warning(f"Output directory does not exist: {output_dir}")
        
        if errors:
            logger.error(f"Configuration validation errors: {errors}")
            return False
        
        logger.debug("Configuration validation passed")
        return True
    
    def __str__(self):
        """String representation of config."""
        lines = ["Converter Configuration:"]
        for key, value in self.config.items():
            lines.append(f"  {key}: {value}")
        return "\n".join(lines)


def create_default_config(output_file=None):
    """Create a default configuration file."""
    output_path = output_file or CONFIG_LOCATIONS[0]
    
    try:
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        
        with open(output_path, 'w') as f:
            json.dump(DEFAULT_CONFIG, f, indent=2)
        
        logger.info(f"Created default config file at: {output_path}")
        return str(output_path)
    except Exception as e:
        logger.error(f"Could not create config file: {e}")
        return None


def print_config_template():
    """Print a template config file to stdout."""
    print("# Document Converter Configuration Template")
    print("# Save as converter_config.json")
    print(json.dumps(DEFAULT_CONFIG, indent=2))
